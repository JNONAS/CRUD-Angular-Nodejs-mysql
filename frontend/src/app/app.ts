
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from './services/produto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  produtos: any[] = [];

  mensagem = '';

  // Campos para cadastrar
  nomeNovo = '';
  precoNovo: number | null = null;
  estoqueNovo: number | null = null;

  // Campos para editar
  produtoEditandoId: number | null = null;
  nomeEditado = '';
  precoEditado: number | null = null;
  estoqueEditado: number | null = null;

  constructor(
    private produtoService: ProdutoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listarProdutos();
  }

  // LISTAR PRODUTOS
  listarProdutos(): void {
    this.produtoService.listarProdutos().subscribe({
      next: (dados) => {
        console.log('Produtos recebidos:', dados);

        this.produtos = dados;
        this.cdr.detectChanges();

        console.log('Quantidade na variável:', this.produtos.length);
      },
      error: (erro) => {
        console.error('Erro ao listar produtos:', erro);
        this.mensagem = 'Erro ao carregar os produtos.';
      }
    });
  }

  // CADASTRAR PRODUTO
  cadastrarProduto(): void {
    if (
      !this.nomeNovo.trim() ||
      this.precoNovo === null ||
      this.precoNovo < 0 ||
      this.estoqueNovo === null ||
      this.estoqueNovo < 0 ||
      !Number.isInteger(this.estoqueNovo)
    ) {
      this.mensagem = 'Preencha todos os campos corretamente.';
      return;
    }

    const produto = {
      nome: this.nomeNovo.trim(),
      preco: this.precoNovo,
      estoque: this.estoqueNovo
    };

    this.produtoService.cadastrarProduto(produto).subscribe({
      next: () => {
        this.mensagem = 'Produto cadastrado com sucesso!';

        this.nomeNovo = '';
        this.precoNovo = null;
        this.estoqueNovo = null;

        this.listarProdutos();
      },
      error: (erro) => {
        console.error('Erro ao cadastrar produto:', erro);
        this.mensagem = 'Erro ao cadastrar produto.';
      }
    });
  }

  // COMEÇAR A EDITAR
  iniciarEdicao(produto: any): void {
    this.produtoEditandoId = produto.id;
    this.nomeEditado = produto.nome;
    this.precoEditado = Number(produto.preco);
    this.estoqueEditado = Number(produto.estoque);
    this.mensagem = '';
  }

  // CANCELAR EDIÇÃO
  cancelarEdicao(): void {
    this.produtoEditandoId = null;
    this.nomeEditado = '';
    this.precoEditado = null;
    this.estoqueEditado = null;
  }

  // SALVAR ALTERAÇÕES
  salvarEdicao(): void {
    if (
      this.produtoEditandoId === null ||
      !this.nomeEditado.trim() ||
      this.precoEditado === null ||
      this.precoEditado < 0 ||
      this.estoqueEditado === null ||
      this.estoqueEditado < 0 ||
      !Number.isInteger(this.estoqueEditado)
    ) {
      this.mensagem = 'Preencha os campos corretamente.';
      return;
    }

    const produtoAtualizado = {
      nome: this.nomeEditado.trim(),
      preco: this.precoEditado,
      estoque: this.estoqueEditado
    };

    this.produtoService
      .atualizarProduto(this.produtoEditandoId, produtoAtualizado)
      .subscribe({
        next: () => {
          this.mensagem = 'Produto atualizado com sucesso!';

          this.cancelarEdicao();
          this.listarProdutos();
        },
        error: (erro) => {
          console.error('Erro ao atualizar produto:', erro);
          this.mensagem = 'Erro ao atualizar produto.';
        }
      });
  }

  // EXCLUIR PRODUTO
  excluirProduto(id: number): void {
    const confirmar = window.confirm(
      'Tem certeza de que deseja excluir este produto?'
    );

    if (!confirmar) {
      return;
    }

    this.produtoService.deletarProduto(id).subscribe({
      next: () => {
        this.mensagem = 'Produto excluído com sucesso!';
        this.listarProdutos();
      },
      error: (erro) => {
        console.error('Erro ao excluir produto:', erro);
        this.mensagem = 'Erro ao excluir produto.';
      }
    });
  }
}
