'use client'  
import { useEffect, useState } from "react"  
import Link from 'next/link'  
import ItemComputador from '@/components/ItemComputador'  
import { ComputadorI } from "@/utils/types/computadores"  

function CadComputadores() {  
  const [computadores, setComputadores] = useState<ComputadorI[]>([])  
  const [loading, setLoading] = useState(true)  

  useEffect(() => {  
    async function getComputadores() {  
      try {  
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/computadores`)  
        const dados = await response.json()  
        setComputadores(dados)  
      } catch (error) {  
        console.error("Erro ao carregar computadores:", error)  
      } finally {  
        setLoading(false)  
      }  
    }  
    getComputadores()  
  }, [])  

  return (  
    <div className='min-h-screen w-full bg-colorUvaEscura px-6 py-24'>  
      <div className="max-w-7xl mx-auto">  
        <div className='flex justify-between items-center mb-8'>  
          <h1 className="text-3xl font-extrabold text-colorAmareloDourado">  
            Cadastro de Computadores  
          </h1>  
          <Link  
            href="computadores/novo"  
            className="bg-colorAmareloDourado text-colorRoxoEscuro px-4 py-2 rounded-lg font-medium hover:bg-colorAmareloDourado/90 transition-colors"  
          >  
            Novo Computador  
          </Link>  
        </div>  

        <div className="bg-colorBeringela/80 rounded-lg shadow-xl border border-colorRoxoEscuro/30 overflow-hidden">  
          <table className="w-full">  
            <thead className="bg-colorRoxoEscuro/50">  
              <tr>  
                <th scope="col" className="px-6 py-4 text-left text-colorAmareloDourado font-semibold">FOTO</th>  
                <th scope="col" className="px-6 py-4 text-left text-colorAmareloDourado font-semibold">MODELO</th>  
                <th scope="col" className="px-6 py-4 text-left text-colorAmareloDourado font-semibold">MARCA</th>  
                <th scope="col" className="px-6 py-4 text-left text-colorAmareloDourado font-semibold">ESPECIFICAÇÕES</th>  
                <th scope="col" className="px-6 py-4 text-left text-colorAmareloDourado font-semibold">PREÇO R$</th>  
                <th scope="col" className="px-6 py-4 text-left text-colorAmareloDourado font-semibold">AÇÕES</th>  
              </tr>  
            </thead>  
            <tbody className="divide-y divide-colorRoxoEscuro/30">  
              {loading ? (  
                <tr>  
                  <td colSpan={6} className="px-6 py-4 text-center">  
                    <div className="flex justify-center items-center">  
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-colorAmareloDourado"></div>  
                    </div>  
                  </td>  
                </tr>  
              ) : computadores.map(computador => (  
                <ItemComputador  
                  key={computador.id}  
                  computador={computador}  
                  computadores={computadores}  
                  setComputadores={setComputadores}  
                />  
              ))}  
            </tbody>  
          </table>  
        </div>  
      </div>  
    </div>  
  )  
}  

export default CadComputadores