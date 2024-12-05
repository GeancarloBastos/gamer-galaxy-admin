import { MarcaI } from "./marcas"

export interface ComputadorI {
  id: number
  modelo: string
  ano: number
  preco: number
  especificacoes?: string
  tipo: string
  destaque: boolean
  foto: string
  marca: MarcaI
  marcaId: number,
}