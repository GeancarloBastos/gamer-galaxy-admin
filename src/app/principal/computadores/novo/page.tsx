'use client'  
import { useForm } from "react-hook-form"  
import Cookies from "js-cookie"  
import { toast } from "sonner"  
import { useState, useEffect } from "react"  
import { MarcaI } from "@/utils/types/marcas"  

type Inputs = {  
  modelo: string  
  marcaId: number  
  especificacoes?: string  
  preco: number  
  foto: string  
  tipo: string  
}  

function NovoComputador() {  
  const [marcas, setMarcas] = useState<MarcaI[]>([])  
  const [isSubmitting, setIsSubmitting] = useState(false)  
  
  const {  
    register,  
    handleSubmit,  
    reset,  
    setFocus  
  } = useForm<Inputs>()  

  useEffect(() => {  
    async function getMarcas() {  
      try {  
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/marcas`)  
        const dados = await response.json()  
        setMarcas(dados)  
      } catch (error) {  
        console.error(error)  
        toast.error("Erro ao carregar marcas")  
      }  
    }  
    getMarcas()  
    setFocus("modelo")  
  }, [setFocus])  

  async function incluirComputador(data: Inputs) {  
    setIsSubmitting(true)  
    
    try {  
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/computadores`,  
        {  
          method: "POST",  
          headers: {  
            "Content-type": "application/json",  
            "Authorization": `Bearer ${Cookies.get("admin_logado_token")}`  
          },  
          body: JSON.stringify({  
            modelo: data.modelo,  
            marcaId: Number(data.marcaId),  
            especificacoes: data.especificacoes,  
            foto: data.foto,  
            preco: Number(data.preco),  
            tipo: data.tipo  
          })  
        }  
      )  

      if (response.status === 201) {  
        toast.success("Computador cadastrado com sucesso")  
        reset()  
      } else {  
        toast.error("Erro no cadastro do Computador")  
      }  
    } catch (error) {  
      console.error(error)  
      toast.error("Erro ao conectar com o servidor")  
    } finally {  
      setIsSubmitting(false)  
    }  
  }  
 
  return (  
    <div className="flex flex-col items-center justify-start min-h-screen w-full bg-colorUvaEscura">   
      <div className="w-full max-w-4xl pt-24 px-4">  
        <h1 className="text-3xl font-extrabold text-center text-colorAmareloDourado mb-8">  
          Inclusão de Computadores  
        </h1>  

        <form onSubmit={handleSubmit(incluirComputador)}   
          className="bg-colorBeringela/80 shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4 border border-colorRoxoEscuro/30 w-full">  
          <div className="mb-6">  
            <label className="block text-colorAmareloDourado text-sm font-bold mb-2">  
              Modelo  
            </label>  
            <input  
              type="text"  
              {...register("modelo")}  
              className="shadow-sm w-full px-3 py-2 border border-colorRoxoEscuro rounded-lg focus:ring-2 focus:ring-colorAmareloDourado focus:border-transparent bg-colorUvaEscura text-white"  
              required  
            />  
          </div>  

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">  
            <div>  
              <label className="block text-colorAmareloDourado text-sm font-bold mb-2">  
                Marca  
              </label>  
              <select  
                {...register("marcaId")}  
                className="shadow-sm w-full px-3 py-2 border border-colorRoxoEscuro rounded-lg focus:ring-2 focus:ring-colorAmareloDourado focus:border-transparent bg-colorUvaEscura text-white"  
                required  
              >  
                <option value="">Selecione...</option>  
                {marcas.map(marca => (  
                  <option key={marca.id} value={marca.id}>{marca.nome}</option>  
                ))}  
              </select>  
            </div>  

            <div>  
              <label className="block text-colorAmareloDourado text-sm font-bold mb-2">  
                Preço R$  
              </label>  
              <input  
                type="number"  
                step="0.01"  
                {...register("preco")}  
                className="shadow-sm w-full px-3 py-2 border border-colorRoxoEscuro rounded-lg focus:ring-2 focus:ring-colorAmareloDourado focus:border-transparent bg-colorUvaEscura text-white"  
                required  
              />  
            </div>  
          </div>  

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">  
            <div>  
              <label className="block text-colorAmareloDourado text-sm font-bold mb-2">  
                URL da Foto  
              </label>  
              <input  
                type="text"  
                {...register("foto")}  
                className="shadow-sm w-full px-3 py-2 border border-colorRoxoEscuro rounded-lg focus:ring-2 focus:ring-colorAmareloDourado focus:border-transparent bg-colorUvaEscura text-white"  
                required  
              />  
            </div>  

            <div>  
              <label className="block text-colorAmareloDourado text-sm font-bold mb-2">  
                Tipo  
              </label>  
              <select  
                {...register("tipo")}  
                className="shadow-sm w-full px-3 py-2 border border-colorRoxoEscuro rounded-lg focus:ring-2 focus:ring-colorAmareloDourado focus:border-transparent bg-colorUvaEscura text-white"  
                required  
              >  
                <option value="DESKTOP">Desktop</option>  
                <option value="NOTEBOOK">Notebook</option>  
                <option value="LAPTOP">Laptop</option>  
              </select>  
            </div>  
          </div>  

          <div className="mb-6">  
            <label className="block text-colorAmareloDourado text-sm font-bold mb-2">  
              Especificações  
            </label>  
            <textarea  
              {...register("especificacoes")}  
              rows={4}  
              className="shadow-sm w-full px-3 py-2 border border-colorRoxoEscuro rounded-lg focus:ring-2 focus:ring-colorAmareloDourado focus:border-transparent bg-colorUvaEscura text-white"  
            />  
          </div>  

          <div className="flex items-center justify-end">  
            <button  
              type="submit"  
              disabled={isSubmitting}  
              className="bg-colorRoxoEscuro hover:bg-colorBeringela text-colorAmareloDourado font-bold py-2 px-6 rounded-lg   
              focus:outline-none focus:ring-2 focus:ring-colorAmareloDourado focus:ring-offset-2 focus:ring-offset-colorBeringela   
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200  
              border border-colorAmareloDourado hover:shadow-lg hover:shadow-colorAmareloDourado/20"  
            >  
              {isSubmitting ? 'Salvando...' : 'Salvar'}  
            </button>  
          </div>  
        </form>  
      </div>  
    </div>  
  )
}  

export default NovoComputador