'use client'
import { useEffect, useState } from "react"
import { PropostaI } from "@/utils/types/propostas"
import { TiDeleteOutline } from "react-icons/ti"
import { FaRegEdit } from "react-icons/fa"
import Cookies from "js-cookie"

export default function ControlePropostas() {
  const [propostas, setPropostas] = useState<PropostaI[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedProposta, setSelectedProposta] = useState<PropostaI | null>(null)

  useEffect(() => {
    getPropostas()
  }, [])

  async function getPropostas() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas`)
      if (!response.ok) throw new Error('Erro ao buscar propostas')
      const dados = await response.json()
      setPropostas(dados)
    } catch (error) {
      console.error("Erro ao buscar propostas:", error)
    }
  }

  async function responderProposta(resposta: string) {
    if (!selectedProposta || !resposta.trim()) return

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas/${selectedProposta.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
        },
        body: JSON.stringify({ resposta })
      },
    )

    if (response.ok) {
      const propostas2 = propostas.map(x => {
        if (x.id === selectedProposta.id) {
          return { ...x, resposta }
        }
        return x
      })
      setPropostas(propostas2)
      setShowModal(false)
      setSelectedProposta(null)
    }
  }

  const statusCount = {
    pendentes: propostas.filter(p => !p.resposta).length,
    aprovadas: propostas.filter(p => p.resposta).length,
    total: propostas.length
  }

  return (
    <div className="min-h-screen w-full bg-colorUvaEscura p-8">
      <h1 className="text-3xl text-colorAmareloDourado font-bold mb-8">
        Controle de Propostas
      </h1>

      {/* Cards de Status */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-colorBeringela p-4 rounded-lg">
          <h3 className="text-yellow-400">Pendentes</h3>
          <p className="text-4xl text-white">{statusCount.pendentes}</p>
        </div>
        <div className="bg-colorBeringela p-4 rounded-lg">
          <h3 className="text-green-400">Aprovadas</h3>
          <p className="text-4xl text-white">{statusCount.aprovadas}</p>
        </div>
        <div className="bg-colorBeringela p-4 rounded-lg">
          <h3 className="text-colorAmareloDourado">Total</h3>
          <p className="text-4xl text-white">{statusCount.total}</p>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-colorRoxoEscuro rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-colorBeringela">
            <tr>
              <th className="text-left p-4 text-colorAmareloDourado">FOTO</th>
              <th className="text-left p-4 text-colorAmareloDourado">MODELO</th>
              <th className="text-left p-4 text-colorAmareloDourado">PREÇO R$</th>
              <th className="text-left p-4 text-colorAmareloDourado">CLIENTE</th>
              <th className="text-left p-4 text-colorAmareloDourado">PROPOSTA</th>
              <th className="text-left p-4 text-colorAmareloDourado">STATUS</th>
              <th className="text-left p-4 text-colorAmareloDourado">RESPOSTA</th>
              <th className="text-left p-4 text-colorAmareloDourado">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {propostas.map(proposta => (
              <tr key={proposta.id} className="border-b border-colorRoxoEscuro">
                <td className="p-4">
                  <img
                    src={proposta.computador.foto}
                    alt={proposta.computador.modelo}
                    className="w-24 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-4 text-white">{proposta.computador.modelo}</td>
                <td className="p-4 text-white">
                  {Number(proposta.computador.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </td>
                <td className="p-4 text-white">{proposta.cliente.nome}</td>
                <td className="p-4 text-white">{proposta.descricao}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${proposta.resposta
                    ? 'bg-green-400/20 text-green-400'
                    : 'bg-yellow-400/20 text-yellow-400'
                    }`}>
                    {proposta.resposta ? 'Aprovada' : 'Pendente'}
                  </span>
                </td>
                <td className="p-4 text-white">
                  {proposta.resposta || 'Aguardando resposta'}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProposta(proposta)
                        setShowModal(true)
                      }}
                      className="p-2 hover:bg-colorAmareloDourado/20 rounded-full"
                      title="Responder proposta"
                    >
                      <FaRegEdit className="text-colorAmareloDourado" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Confirma a exclusão?')) {
                          // Lógica de exclusão existente  
                        }
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-full"
                      title="Excluir proposta"
                    >
                      <TiDeleteOutline className="text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-colorBeringela p-6 rounded-lg w-96">
            <h3 className="text-lg text-colorAmareloDourado mb-4">
              Responder Proposta
            </h3>

            <div className="mb-4">
              <p className="text-white mb-2">Proposta: {selectedProposta?.descricao}</p>
              <input
                type="text"
                className="w-full p-2 rounded bg-colorRoxoEscuro text-white"
                placeholder="Digite sua resposta"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    responderProposta(e.currentTarget.value)
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-white"
              >
                Cancelar
              </button>
              <button
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.parentElement?.querySelector('input')
                  if (input) {
                    responderProposta(input.value)
                  }
                }}
                className="px-4 py-2 bg-colorAmareloDourado text-black rounded"
              >
                Responder
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  )
}