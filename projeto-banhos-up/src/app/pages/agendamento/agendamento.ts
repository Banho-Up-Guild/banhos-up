import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Pet = {
  id: number;
  nome: string;
  especie: 'Cachorro' | 'Gato';
  porte: string;
};

type Servico = {
  id: string;
  nome: string;
  preco: number;
  duracao: number;
  descricao?: string;
  obrigatorio?: boolean;
  grupo: string;
};

type Loja = {
  id: number;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
};

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.css',
})
export class Agendamento {

  etapa = 0;

  // PETS
  pets: Pet[] = [
    { id: 1, nome: 'Pet 1', especie: 'Cachorro', porte: 'Médio' },
    { id: 2, nome: 'Pet 2', especie: 'Gato', porte: 'Pequeno' },
  ];

  petsSelecionados: number[] = [1];

  novoPet = {
    nome: '',
    especie: 'Cachorro' as 'Cachorro' | 'Gato',
    porte: 'Médio'
  };

  mostrarNovoPet = false;

  // LOJAS
  cep = '';
  estado = '';
  cidade = '';

  lojaSelecionada: number | null = 1;

  lojas: Loja[] = [
    {
      id: 1,
      nome: 'BanhosUp Diadema',
      endereco: 'Rua Juruá, 79',
      cidade: 'Taboão, Diadema',
      estado: 'SP',
      cep: '09932-220'
    },
    {
      id: 2,
      nome: 'BanhosUp Embu-Guaçu',
      endereco: 'Estrada da Olaria, 6713',
      cidade: 'Chácara dos Amigos, Embu-Guaçu',
      estado: 'SP',
      cep: '06909-720'
    }
  ];

  // SERVIÇOS
  servicos: Servico[] = [
    {
      id: 'banho',
      nome: 'Banho',
      preco: 170,
      duracao: 90,
      obrigatorio: true,
      grupo: 'Principal'
    },
    {
      id: 'tosa-tesoura',
      nome: 'Tosa com tesoura',
      preco: 60,
      duracao: 90,
      descricao: 'Indicado para cortes personalizados',
      grupo: 'Tosas'
    },
    {
      id: 'tosa-higienica',
      nome: 'Tosa higiênica',
      preco: 30,
      duracao: 120,
      grupo: 'Tosas'
    },
    {
      id: 'escovacao',
      nome: 'Escovação dental',
      preco: 11,
      duracao: 15,
      descricao: 'Indicado para prevenção de tártaro e mau hálito',
      grupo: 'Cuidados adicionais'
    },
    {
      id: 'argan',
      nome: 'Manutenção argan',
      preco: 30,
      duracao: 20,
      descricao: 'Para pelo sem brilho, ressecado ou áspero',
      grupo: 'Tratamento de pelagem e pele'
    },
    {
      id: 'nutricao',
      nome: 'Nutrição ouro',
      preco: 35,
      duracao: 25,
      descricao: 'Para pelo frágil, com queda ou elástico',
      grupo: 'Tratamento de pelagem e pele'
    },
    {
      id: 'liso',
      nome: 'Liso perfeito',
      preco: 30,
      duracao: 25,
      descricao: 'Para pelo poroso, desalinhado ou com frizz',
      grupo: 'Tratamento de pelagem e pele'
    }
  ];

  servicosPorPet: Record<number, string[]> = {
    1: ['banho']
  };

  // PROFISSIONAIS
  profissionais = [
    'Sem preferência de profissional',
    'Gabriel Ramon Evangelista Ramos',
    'Eryka Karolyna Marçal dos Santos',
    'Camila Santos de Barros'
  ];

  profissionalPorPet: Record<number, string> = {};
  observacoes: Record<number, string> = {};

  // DATA E HORÁRIO
  mesAtual = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  dataSelecionada = '';
  horarioSelecionado = '09:00';

  horarios = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30'
  ];

  termosAceitos = false;
  confirmado = false;

  // GETTERS
  get petsAtivos(): Pet[] {
    return this.pets.filter(p =>
      this.petsSelecionados.includes(p.id)
    );
  }

  get lojaAtual(): Loja | undefined {
    return this.lojas.find(l =>
      l.id === this.lojaSelecionada
    );
  }

  get total(): number {
    return this.petsAtivos.reduce(
      (s, p) => s + this.precoPet(p.id),
      0
    );
  }

  get duracaoTotal(): number {
    return Math.max(
      30,
      ...this.petsAtivos.map(p => this.duracaoPet(p.id))
    );
  }

  get diasMes(): (number | null)[] {
    const primeiro = new Date(
      this.mesAtual.getFullYear(),
      this.mesAtual.getMonth(),
      1
    ).getDay();

    const total = new Date(
      this.mesAtual.getFullYear(),
      this.mesAtual.getMonth() + 1,
      0
    ).getDate();

    return [
      ...Array(primeiro).fill(null),
      ...Array.from({ length: total }, (_, i) => i + 1)
    ];
  }

  get tituloMes(): string {
    return this.mesAtual.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  }

  get dataFormatada(): string {
    if (!this.dataSelecionada) {
      return 'Selecione uma data';
    }

    return new Date(
      `${this.dataSelecionada}T12:00:00`
    ).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // NAVEGAÇÃO
  avancar(): void {
    if (this.etapa === 0 && this.petsSelecionados.length === 0) {
      return;
    }

    if (this.etapa === 1 && !this.lojaSelecionada) {
      return;
    }

    if (
      this.etapa === 2 &&
      this.petsAtivos.some(p =>
        !(this.servicosPorPet[p.id] || []).includes('banho')
      )
    ) {
      return;
    }

    if (
      this.etapa === 4 &&
      (!this.dataSelecionada || !this.horarioSelecionado)
    ) {
      return;
    }

    if (this.etapa < 5) {
      this.etapa++;
    }
  }

  voltar(): void {
    if (this.etapa > 0) {
      this.etapa--;
    }
  }

  // SELEÇÃO DE PETS
  alternarPet(id: number): void {
    this.petsSelecionados =
      this.petsSelecionados.includes(id)
        ? this.petsSelecionados.filter(x => x !== id)
        : [...this.petsSelecionados, id];
  }

  adicionarPet(): void {
    if (!this.novoPet.nome.trim()) {
      return;
    }

    const id = Math.max(
      0,
      ...this.pets.map(p => p.id)
    ) + 1;

    this.pets.push({
      id,
      ...this.novoPet
    });

    this.servicosPorPet[id] = ['banho'];

    this.petsSelecionados = [
      ...this.petsSelecionados,
      id
    ];

    this.novoPet = {
      nome: '',
      especie: 'Cachorro',
      porte: 'Médio'
    };

    this.mostrarNovoPet = false;
  }

  // SERVIÇOS
  servicosPet(id: number): string[] {
    return this.servicosPorPet[id] || [];
  }

  alternarServico(petId: number, servico: Servico): void {
    const atuais = [...this.servicosPet(petId)];

    if (servico.obrigatorio) {
      return;
    }

    this.servicosPorPet[petId] =
      atuais.includes(servico.id)
        ? atuais.filter(x => x !== servico.id)
        : [...atuais, servico.id];
  }

  precoPet(id: number): number {
    return this.servicos
      .filter(s => this.servicosPet(id).includes(s.id))
      .reduce((v, s) => v + s.preco, 0);
  }

  duracaoPet(id: number): number {
    return this.servicos
      .filter(s => this.servicosPet(id).includes(s.id))
      .reduce((v, s) => v + s.duracao, 0);
  }

  precoServico(id: string): number {
    return this.servicos.find(s => s.id === id)?.preco || 0;
  }

  nomeServico(id: string): string {
    return this.servicos.find(s => s.id === id)?.nome || '';
  }

  grupoServicos(): string[] {
    return [...new Set(this.servicos.map(s => s.grupo))];
  }

  servicosDoGrupo(grupo: string): Servico[] {
    return this.servicos.filter(s => s.grupo === grupo);
  }

  // CALENDÁRIO
  mudarMes(delta: number): void {
    this.mesAtual = new Date(
      this.mesAtual.getFullYear(),
      this.mesAtual.getMonth() + delta,
      1
    );
  }

  selecionarDia(dia: number): void {
    const d = new Date(
      this.mesAtual.getFullYear(),
      this.mesAtual.getMonth(),
      dia
    );

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (d < hoje) {
      return;
    }

    this.dataSelecionada =
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  diaSelecionado(dia: number): boolean {
    return this.dataSelecionada ===
      `${this.mesAtual.getFullYear()}-${String(this.mesAtual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  }

  diaPassado(dia: number): boolean {
    const d = new Date(
      this.mesAtual.getFullYear(),
      this.mesAtual.getMonth(),
      dia
    );

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return d < hoje;
  }

  // CONFIRMAÇÃO
  confirmar(): void {
    if (this.termosAceitos) {
      this.confirmado = true;
    }
  }

  formatar(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}
