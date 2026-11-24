import React, { useEffect, useRef } from 'react';

export const WaterShaderBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Vertex Shader simples para cobrir o viewport
    const vsSource = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = (aPosition + 1.0) * 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Água Viva da Represa com reflexos dourados e distorção orgânica fbm
    const fsSource = `
      precision mediump float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = p * 2.0 + vec2(13.7, 9.1);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        float t = uTime * 0.25;

        // Ondulações fluidas orgânicas da represa
        vec2 p = uv * 3.5;
        vec2 warp = vec2(
          fbm(p + vec2(t * 0.2, t * 0.1)),
          fbm(p + vec2(5.2, 1.3) - vec2(t * 0.15, -t * 0.05))
        );
        float w = fbm(p + 0.8 * warp);

        // Ondas superficiais
        float waves = sin(uv.x * 8.0 + t * 2.0) * 0.02 + sin(uv.y * 6.0 - t * 1.5) * 0.015;
        float depth = clamp(w + waves, 0.0, 1.0);

        // Paleta Nobre: Águas Profundas da Represa + Ouro da Alvorada
        vec3 deepWater = vec3(0.035, 0.055, 0.085);  // #090E16 - Água abissal repousante
        vec3 calmBlue  = vec3(0.08, 0.14, 0.22);     // #142438 - Profundidade serena
        vec3 surfaceBlue = vec3(0.12, 0.28, 0.42);   // #1F476B - Reflexo cristalino
        vec3 goldGlint = vec3(0.83, 0.68, 0.21);     // #D4AF37 - Ouro Imperial da Bússola

        vec3 color = mix(deepWater, calmBlue, smoothstep(0.1, 0.6, depth));
        color = mix(color, surfaceBlue, smoothstep(0.55, 0.85, depth));

        // Reflexos de luz dourada nos picos das ondas
        float glint = pow(depth, 5.0) * 0.35;
        color += goldGlint * glint;

        // Vinheta sutil nas bordas para profundidade cinematográfica
        float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
        vignette = clamp(pow(16.0 * vignette, 0.35), 0.0, 1.0);
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(type: number, source: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad fullscreen
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uResLoc = gl.getUniformLocation(program, 'uResolution');
    const uMouseLoc = gl.getUniformLocation(program, 'uMouse');

    let animationFrameId: number;
    let startTime = performance.now();

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
    }

    window.addEventListener('resize', resize);
    resize();

    // Mouse / Touch interatividade suave
    let mouseX = 0.5;
    let mouseY = 0.5;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouseX = clientX / window.innerWidth;
      mouseY = 1.0 - clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });

    function render() {
      if (!gl) return;
      const elapsed = (performance.now() - startTime) * 0.001;
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uMouseLoc, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-60"
      style={{ filter: 'contrast(1.15) brightness(0.95)' }}
    />
  );
};
