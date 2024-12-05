'use client'  
import { useEffect, useState } from "react";  
import { Chart } from "react-google-charts";  
import { FiUsers, FiMonitor, FiFileText } from "react-icons/fi";  
import { ComputadorI } from "@/utils/types/computadores";  

interface DashboardData {  
  totalClientes: number;  
  totalComputadores: number;  
  totalPropostas: number;  
  computadores: ComputadorI[];  
}  

export default function Principal() {  
  const [dados, setDados] = useState<DashboardData>({  
    totalClientes: 0,  
    totalComputadores: 0,  
    totalPropostas: 0,  
    computadores: []  
  });  

  useEffect(() => {  
    async function carregarDados() {  
      try {  
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/computadores`);  
        const computadores = await response.json();  
        
        setDados({  
          totalClientes: 0, // Substituir quando tiver endpoint  
          totalComputadores: computadores.length,  
          totalPropostas: 0, // Substituir quando tiver endpoint  
          computadores  
        });  
      } catch (error) {  
        console.error("Erro ao carregar dados:", error);  
      }  
    }  
    carregarDados();  
  }, []);  

  // Processando dados para o gráfico de marcas  
  const dadosMarcas: (string | number | { role: string })[][] = [["Marca", "Quantidade", { role: "style" }]];  
  const marcasCount = dados.computadores.reduce((acc, comp) => {  
    acc[comp.marca.nome] = (acc[comp.marca.nome] || 0) + 1;  
    return acc;  
  }, {} as Record<string, number>);  

  Object.entries(marcasCount).forEach(([marca, quantidade], index) => {  
    dadosMarcas.push([marca, quantidade, `hsl(${index * 50}, 70%, 50%)`]);  
  });  

  // Processando dados para o gráfico de tipos  
  const dadosTipos: (string | number | { role: string })[][] = [["Tipo", "Quantidade", { role: "style" }]];  
  const tiposCount = dados.computadores.reduce((acc, comp) => {  
    acc[comp.tipo] = (acc[comp.tipo] || 0) + 1;  
    return acc;  
  }, {} as Record<string, number>);  

  Object.entries(tiposCount).forEach(([tipo, quantidade], index) => {  
    dadosTipos.push([tipo, quantidade, `hsl(${index * 50}, 70%, 50%)`]);    
  });  

  const opcoesColuna = {  
    backgroundColor: 'transparent',  
    chartArea: { width: '80%', height: '70%' },  
    legend: { position: 'none' },  
    vAxis: {   
      minValue: 0,  
      textStyle: { color: '#FFF' },  
      gridlines: { color: '#444' }  
    },  
    hAxis: {  
      textStyle: { color: '#FFF' },  
      gridlines: { color: '#444' }  
    },  
    theme: 'maximized'  
  };  

  const opcoesPizza = {  
    backgroundColor: 'transparent',  
    chartArea: { width: '80%', height: '80%' },  
    legend: {   
      textStyle: { color: '#FFF' },  
      position: 'right'  
    },  
    theme: 'maximized'  
  };  

  return (  
    <div className="container mt-24">  
      <h2 className="text-3xl mb-8 font-bold text-white">  
        Painel de Controle  
      </h2>  

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">  
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">  
          <div className="flex items-center justify-between mb-4">  
            <div className="bg-blue-900 p-3 rounded-lg">  
              <FiUsers className="text-blue-300 text-2xl" />  
            </div>  
            <span className="text-3xl font-bold text-white">  
              {dados.totalClientes}  
            </span>  
          </div>  
          <p className="text-gray-300 font-medium">Total de Clientes</p>  
        </div>  

        <div className="bg-gray-800 rounded-xl shadow-lg p-6">  
          <div className="flex items-center justify-between mb-4">  
            <div className="bg-red-900 p-3 rounded-lg">  
              <FiMonitor className="text-red-300 text-2xl" />  
            </div>  
            <span className="text-3xl font-bold text-white">  
              {dados.totalComputadores}  
            </span>  
          </div>  
          <p className="text-gray-300 font-medium">Total de Computadores</p>  
        </div>  

        <div className="bg-gray-800 rounded-xl shadow-lg p-6">  
          <div className="flex items-center justify-between mb-4">  
            <div className="bg-green-900 p-3 rounded-lg">  
              <FiFileText className="text-green-300 text-2xl" />  
            </div>  
            <span className="text-3xl font-bold text-white">  
              {dados.totalPropostas}  
            </span>  
          </div>  
          <p className="text-gray-300 font-medium">Total de Propostas</p>  
        </div>  
      </div>  

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">  
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">  
          <h3 className="text-xl font-bold mb-4 text-white">  
            Computadores por Marca  
          </h3>  
          {dados.computadores.length > 0 && (  
            <Chart  
              chartType="ColumnChart"  
              width="100%"  
              height="400px"  
              data={dadosMarcas}  
              options={opcoesColuna}  
            />  
          )}  
        </div>  

        <div className="bg-gray-800 rounded-xl shadow-lg p-6">  
          <h3 className="text-xl font-bold mb-4 text-white">  
            Computadores por Tipo  
          </h3>  
          {dados.computadores.length > 0 && (  
            <Chart  
              chartType="PieChart"  
              width="100%"  
              height="400px"  
              data={dadosTipos}  
              options={opcoesPizza}  
            />  
          )}  
        </div>  
      </div>  
    </div>  
  );  
}