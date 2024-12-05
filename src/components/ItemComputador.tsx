'use client'  
import { Dispatch, SetStateAction, useState } from "react"  
import { FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi"  
import Cookies from "js-cookie"  
import { ComputadorI } from "@/utils/types/computadores"  

interface listaComputadorProps {  
  computador: ComputadorI,  
  computadores: ComputadorI[],  
  setComputadores: Dispatch<SetStateAction<ComputadorI[]>>  
}  

function ItemComputador({ computador, computadores, setComputadores }: listaComputadorProps) {  
  const [isEditing, setIsEditing] = useState(false)  
  const [editedData, setEditedData] = useState(computador)  

  async function excluirComputador() {  
    if (confirm(`Confirma a exclusão`)) {  
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/computadores/${computador.id}`,  
        {  
          method: "DELETE",  
          headers: {  
            "Content-type": "application/json",  
            Authorization: "Bearer " + Cookies.get("admin_logado_token") as string  
          },  
        },  
      )  

      if (response.status == 200) {  
        const computadores2 = computadores.filter(x => x.id != computador.id)  
        setComputadores(computadores2)  
        alert("Computador excluído com sucesso")  
      } else {  
        alert("Erro... Computador não foi excluído")  
      }  
    }  
  }  

  async function salvarEdicao() {  
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/computadores/${computador.id}`,  
      {  
        method: "PUT",  
        headers: {  
          "Content-type": "application/json",  
          Authorization: "Bearer " + Cookies.get("admin_logado_token") as string  
        },  
        body: JSON.stringify(editedData)  
      },  
    )  

    if (response.status == 200) {  
      const computadores2 = computadores.map(x =>   
        x.id === computador.id ? editedData : x  
      )  
      setComputadores(computadores2)  
      setIsEditing(false)  
      alert("Computador atualizado com sucesso")  
    } else {  
      alert("Erro ao atualizar computador")  
    }  
  }  

  return (  
    <tr className="border-b border-colorRoxoEscuro/30 bg-colorBeringela/80 hover:bg-colorRoxoEscuro/30 transition-colors">  
      <td className="p-4">  
        <img  
          src={computador.foto}  
          alt={`Foto do ${computador.modelo}`}  
          className="w-32 h-20 object-cover rounded-lg"  
        />  
      </td>  
      <td className="p-4">  
        {isEditing ? (  
          <input  
            type="text"  
            value={editedData.modelo}  
            onChange={e => setEditedData({...editedData, modelo: e.target.value})}  
            className="w-full p-2 rounded bg-colorRoxoEscuro text-white border border-colorRoxoEscuro/30 focus:border-colorAmareloDourado outline-none"  
          />  
        ) : (  
          <span className="text-white">{computador.modelo}</span>  
        )}  
      </td>  
      <td className="p-4 text-white">  
        {computador.marca.nome}  
      </td>  
      <td className="p-4">  
        {isEditing ? (  
          <input  
            type="text"  
            value={editedData.especificacoes}  
            onChange={e => setEditedData({...editedData, especificacoes: e.target.value})}  
            className="w-full p-2 rounded bg-colorRoxoEscuro text-white border border-colorRoxoEscuro/30 focus:border-colorAmareloDourado outline-none"  
          />  
        ) : (  
          <span className="text-white">{computador.especificacoes}</span>  
        )}  
      </td>  
      <td className="p-4">  
        {isEditing ? (  
          <input  
            type="number"  
            value={editedData.preco}  
            onChange={e => setEditedData({...editedData, preco: Number(e.target.value)})}  
            className="w-32 p-2 rounded bg-colorRoxoEscuro text-white border border-colorRoxoEscuro/30 focus:border-colorAmareloDourado outline-none"  
          />  
        ) : (  
          <span className="text-white">  
            {Number(computador.preco).toLocaleString("pt-br", {  
              style: 'currency',  
              currency: 'BRL'  
            })}  
          </span>  
        )}  
      </td>  
      <td className="p-4">  
        <div className="flex items-center gap-2">  
          <button  
            onClick={excluirComputador}  
            className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"  
            title="Excluir"  
          >  
            <FiTrash2 size={20} />  
          </button>  
          
          {isEditing ? (  
            <>  
              <button  
                onClick={salvarEdicao}  
                className="p-2 text-green-400 hover:bg-green-500/20 rounded-full transition-colors"  
                title="Salvar"  
              >  
                <FiCheck size={20} />  
              </button>  
              <button  
                onClick={() => {  
                  setIsEditing(false)  
                  setEditedData(computador)  
                }}  
                className="p-2 text-gray-400 hover:bg-gray-500/20 rounded-full transition-colors"  
                title="Cancelar"  
              >  
                <FiX size={20} />  
              </button>  
            </>  
          ) : (  
            <button  
              onClick={() => setIsEditing(true)}  
              className="p-2 text-colorAmareloDourado hover:bg-colorAmareloDourado/20 rounded-full transition-colors"  
              title="Editar"  
            >  
              <FiEdit2 size={20} />  
            </button>  
          )}  
        </div>  
      </td>  
    </tr>  
  )  
}  

export default ItemComputador  