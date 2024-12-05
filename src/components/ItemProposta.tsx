'use client'  
import { Dispatch, SetStateAction } from "react"  
import { TiDeleteOutline } from "react-icons/ti"  
import { FaRegEdit } from "react-icons/fa"  
import Cookies from "js-cookie"  
import { PropostaI } from "@/utils/types/propostas"  

interface listaPropostaProps {  
  proposta: PropostaI,  
  propostas: PropostaI[],  
  setPropostas: Dispatch<SetStateAction<PropostaI[]>>  
}  

function ItemProposta({ proposta, propostas, setPropostas }: listaPropostaProps) {  
  async function excluirProposta() {  
    if (confirm(`Confirma Exclusão da Proposta "${proposta.descricao}"?`)) {  
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas/${proposta.id}`,  
        {  
          method: "DELETE",  
          headers: {  
            "Content-type": "application/json",  
            Authorization: "Bearer " + Cookies.get("admin_logado_token") as string  
          },  
        },  
      )  

      if (response.status == 200) {  
        const propostas2 = propostas.filter(x => x.id != proposta.id)  
        setPropostas(propostas2)  
        alert("Proposta excluída com sucesso")  
      } else {  
        alert("Erro... Proposta não foi excluída")  
      }  
    }  
  }  

  async function responderProposta() {  
    const respostaRevenda = prompt(`Resposta da GG para "${proposta.descricao}"`)  

    if (respostaRevenda == null || respostaRevenda.trim() == "") {  
      return  
    }  

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas/${proposta.id}`,  
      {  
        method: "PATCH",  
        headers: {  
          "Content-type": "application/json",  
          Authorization: "Bearer " + Cookies.get("admin_logado_token") as string  
        },  
        body: JSON.stringify({resposta: respostaRevenda})  
      },  
    )  

    if (response.status == 200) {  
      const propostas2 = propostas.map(x => {  
        if (x.id == proposta.id) {  
          return { ...x, resposta: respostaRevenda}  
        }  
        return x  
      })  
      setPropostas(propostas2)  
    }  
  }  

  // Função para renderizar o badge de status  
  function StatusBadge() {  
    const isPendente = !proposta.resposta  
    return (  
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${  
        isPendente   
          ? 'text-yellow-400 bg-yellow-400/20'   
          : 'text-green-400 bg-green-400/20'  
      }`}>  
        {isPendente ? 'Pendente' : 'Aprovada'}  
      </span>  
    )  
  }  

  return (  
    <tr className="border-b border-colorRoxoEscuro/30 bg-colorBeringela/80 hover:bg-colorRoxoEscuro/30 transition-colors duration-200">  
      <td className="px-6 py-4">  
        <img   
          src={proposta.computador.foto}   
          alt={`Foto do ${proposta.computador.modelo}`}  
          className="w-32 h-20 object-cover rounded-lg border border-colorRoxoEscuro/30"  
        />  
      </td>  
      <td className="px-6 py-4 text-white font-medium">  
        {proposta.computador.modelo}  
      </td>  
      <td className="px-6 py-4 text-colorAmareloDourado font-semibold">  
        {Number(proposta.computador.preco).toLocaleString("pt-br", {  
          style: 'currency',  
          currency: 'BRL'  
        })}  
      </td>  
      <td className="px-6 py-4 text-white">  
        {proposta.cliente.nome}  
      </td>  
      <td className="px-6 py-4 text-white">  
        {proposta.descricao}  
      </td>  
      <td className="px-6 py-4">  
        <StatusBadge />  
      </td>  
      <td className="px-6 py-4 text-white">  
        {proposta.resposta ||   
          <span className="text-gray-400 italic">Aguardando resposta</span>  
        }  
      </td>  
      <td className="px-6 py-4">  
        <div className="flex justify-center items-center gap-2">  
          {!proposta.resposta && (  
            <button  
              onClick={responderProposta}  
              className="p-2 rounded-full hover:bg-colorAmareloDourado/20 transition-colors group"  
              title="Responder proposta"  
            >  
              <FaRegEdit className="text-xl text-colorAmareloDourado group-hover:text-colorAmareloDourado" />  
            </button>  
          )}  
          <button  
            onClick={excluirProposta}  
            className="p-2 rounded-full hover:bg-red-500/20 transition-colors group"  
            title="Excluir proposta"  
          >  
            <TiDeleteOutline className="text-xl text-red-400 group-hover:text-red-500" />  
          </button>  
        </div>  
      </td>  
    </tr>  
  )  
}  

export default ItemProposta