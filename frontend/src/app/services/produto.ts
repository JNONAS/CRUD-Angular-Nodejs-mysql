import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private apiUrl = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) {}

  listarProdutos() {
    return this.http.get<any[]>(this.apiUrl);
  }

  cadastrarProduto(produto: any) {
    return this.http.post(this.apiUrl, produto);
  }

  atualizarProduto(id: number, produto: any) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, produto);
  }

  deletarProduto(id: number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
