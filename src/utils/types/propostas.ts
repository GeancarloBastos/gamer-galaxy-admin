import { ComputadorI } from "./computadores"  
import { ClienteI } from "./clientes"  

export type StatusProposta = 'PENDENTE' | 'APROVADA' | 'RECUSADA' | 'EM_ANALISE'  

export const StatusPropostaLabel = {  
  PENDENTE: 'Pendente',  
  APROVADA: 'Aprovada',  
  RECUSADA: 'Recusada',  
  EM_ANALISE: 'Em Análise'  
} as const  

export interface PropostaI {  
  id: number  
  clienteId: string  
  cliente: ClienteI  
  computadorId: number  
  computador: ComputadorI  
  descricao: string  
  resposta: string | null  
  status: StatusProposta  
  createdAt: string  
  updatedAt: string | null  
}