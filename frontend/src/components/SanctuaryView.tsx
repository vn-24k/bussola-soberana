import React, { useState } from 'react';
import { Flame, Shield, Heart, Waves, Trophy, Bookmark, Plus, Save } from 'lucide-react';
import { soundFX } from '../lib/sound-fx';

export const SanctuaryView: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<'manifesto' | 'livro' | 'juramento'>('manifesto');
  const [newMemory, setNewMemory] = useState('');
  const [savedMemories, setSavedMemories] = useState<string[]>([
    "A superação dos vícios e a quebra do ciclo da maconha e dos bailes funk.",
    "A promessa sagrada feita à minha filha: construir a soberania plena para ser o pai presente, honrado e provedor.",
    "O batismo na represa: onde a água lavou o peso do passado e despertou o amor pela natação e pela liberdade."
  ]);

  const handleAddMemory = () => {
    if (!newMemory.trim()) return;
    soundFX.playWarmChime();
    setSavedMemories([newMemory.trim(), ...savedMemories]);
    setNewMemory('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="card-soberano p-6 sm:p-8 bg-gradient-to-br from-[#1A1622] via-[#120F18] to-[#0A0C10] border-amber-600/30">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
          <Flame className="w-4 h-4" />
          <span>O Santuário da Identidade • Vinícius Caetano</span>
        </div>
        <h1 className="font-serif-noble text-2xl sm:text-3xl font-bold text-white tracking-wide">
          O Escudo da Alma & Diário de Bordo
        </h1>
        <p className="mt-1 text-sm text-stone-300 max-w-2xl leading-relaxed italic">
          "Quando o mundo tentar me fazer esquecer quem sou, este documento é a minha verdade gravada em pedra. Daqui eu vim. Aqui permaneço. Daqui ninguém me derruba."
        </p>

        {/* Abas Internas */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => { soundFX.playClick(); setSelectedSection('manifesto'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSection === 'manifesto'
                ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                : 'bg-[#141821] text-stone-300 hover:bg-stone-800'
            }`}
          >
            O Manifesto
          </button>
          <button
            onClick={() => { soundFX.playClick(); setSelectedSection('juramento'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSection === 'juramento'
                ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                : 'bg-[#141821] text-stone-300 hover:bg-stone-800'
            }`}
          >
            Juramento da Bússola
          </button>
          <button
            onClick={() => { soundFX.playClick(); setSelectedSection('livro'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSection === 'livro'
                ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                : 'bg-[#141821] text-stone-300 hover:bg-stone-800'
            }`}
          >
            Diário de Bordo ItzReal
          </button>
        </div>
      </div>

      {/* Conteúdo: Manifesto */}
      {selectedSection === 'manifesto' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="card-soberano p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Shield className="w-5 h-5" />
              <h2 className="font-serif-noble font-bold text-base text-white">1. O Barro da Favela: Raiz e Honra</h2>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Não nasci em berço de ouro nem tive a vida facilitada por ninguém. Minha história começou no chão da favela. Mãe de 15 anos, sem preparo, cercada pela escassez. Cresci sem figura paterna. Ter passado fome me ensinou o que a maioria dos homens mimados nunca vai entender: o valor sagrado de um copo de água limpa, de um prato de comida quente e da paz de espírito. Minha simplicidade é a minha maior riqueza.
            </p>
          </div>

          <div className="card-soberano p-6 space-y-3">
            <div className="flex items-center gap-2 text-sky-400">
              <Waves className="w-5 h-5" />
              <h2 className="font-serif-noble font-bold text-base text-white">2. A Água da Represa: Paz e Cura</h2>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              No interior, subindo em cavalos e nadando na represa, conheci a verdadeira liberdade. A água doce lavava o peso e o medo. Dali nasceu meu pacto sagrado com a água: a paixão por nadar, o fascínio pelo mar e pelo surfe. A água é o meu templo de descarrego. Quando estou na água, volto a ser aquele menino livre da represa.
            </p>
          </div>

          <div className="card-soberano p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Trophy className="w-5 h-5" />
              <h2 className="font-serif-noble font-bold text-base text-white">3. O Fogo do Atleta e a Quebra do Ciclo</h2>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Eu tinha talento no campo de barro, inspirado na mágica de Ronaldinho e na disciplina de Cristiano Ronaldo. Na adolescência, enfrentei anos de bailes funk e fumaça, mas rompi o ciclo. Não fui engolido pela lama do conformismo. Trabalhei como motorista autônomo cruzando estados e decidi que a minha mente pertencia à liberdade.
            </p>
          </div>

          <div className="card-soberano p-6 space-y-3">
            <div className="flex items-center gap-2 text-rose-400">
              <Heart className="w-5 h-5" />
              <h2 className="font-serif-noble font-bold text-base text-white">4. O Amor de Pai: O Motor Inabalável</h2>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              No dia em que minha filha nasceu, Deus me revelou o amor verdadeiro. A dor da separação forçada pela pobreza virou o meu motor inegociável. Cada linha de código que escrevo, cada página que estudo tem um propósito: construir a liberdade plena para ser o pai presente, honrado e provedor que ela merece ter. O amor é eterno.
            </p>
          </div>

        </div>
      )}

      {/* Conteúdo: Juramento da Bússola */}
      {selectedSection === 'juramento' && (
        <div className="card-soberano p-8 border-[#D4AF37]/40 max-w-3xl mx-auto space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto">
            <Shield className="w-7 h-7" />
          </div>

          <h2 className="font-serif-noble text-2xl font-bold text-white tracking-wide">
            O Juramento Interior do Guerreiro
          </h2>

          <div className="p-6 rounded-2xl bg-[#10131A] border border-stone-800 text-stone-200 text-sm leading-relaxed text-left space-y-4">
            <p className="italic">
              "Eu não vivo por impulsos do momento, nem pelo humor passageiro do meu cérebro primitivo. Eu sou um construtor, um estudioso disciplinado e um homem que honra a sua palavra sob os olhos de Deus."
            </p>
            <p className="italic">
              "O meu celular não é um cassino de dopamina fácil: ele é a minha oficina, o meu laboratório e a minha fortaleza de estudos."
            </p>
            <p className="font-bold text-[#D4AF37]">
              "Eu controlo o que vejo, o que penso e o que executo."
            </p>
          </div>
        </div>
      )}

      {/* Conteúdo: Diário de Bordo ItzReal */}
      {selectedSection === 'livro' && (
        <div className="space-y-6">
          <div className="card-soberano p-6">
            <h2 className="font-serif-noble font-bold text-lg text-white mb-2">
              Registrar Memória para o Diário de Bordo & Livro
            </h2>
            <p className="text-xs text-stone-400 mb-4">
              Insights, histórias de superação ou reflexões para acrescentar à "Arquitetura de um Homem Livre"
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                placeholder="Escreva uma reflexão ou memória..."
                className="flex-1 bg-[#10131A] border border-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-200 focus:outline-none focus:border-[#D4AF37]/50"
              />
              <button
                onClick={handleAddMemory}
                className="px-6 py-3 rounded-2xl bg-[#D4AF37] hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Registrar
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif-noble text-sm font-bold text-stone-300 uppercase tracking-wider">
              Memórias do Santuário Vivo
            </h3>
            {savedMemories.map((m, idx) => (
              <div key={idx} className="card-soberano p-4 flex items-start gap-3">
                <Bookmark className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <p className="text-xs text-stone-200 leading-relaxed">{m}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
