import { createContext, ReactNode, useContext, Dispatch, SetStateAction, useState, useEffect } from 'react'
import { PositionsProps, SectorProps } from '../components/SectionContainer'
import { api } from '../services/api'

interface UseSectorsProps {
    children: ReactNode
}

interface SectorsContextData {
    sectors: SectorProps[]
    setSectors: Dispatch<SetStateAction<SectorProps[]>>
    getSectorsData: () => void
    deleteSector: (sectorId: number) => Promise<string>
    sectorToEdit: SectorProps
    setSectorToEdit: Dispatch<SetStateAction<SectorProps>>
    positions: PositionsProps[]
    setPositions: Dispatch<SetStateAction<PositionsProps[]>>
}

export const SectorsContext = createContext({} as SectorsContextData)

function SectorsProvider({ children }: UseSectorsProps) {
    const [sectors, setSectors] = useState<SectorProps[]>([])
    const [positions, setPositions] = useState<PositionsProps[]>([])
    const [sectorToEdit, setSectorToEdit] = useState<SectorProps>({} as SectorProps)

    //Chamada assíncrona para resgatar todos os setores e salvar em um estado
    async function getSectorsData() {
        let sectors = await api.get(`/sectors`)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return []
            })

        let positions = await api.get('/positions')
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return []
            })

        setPositions(positions)

        setSectors(sectors.map((sector: SectorProps) => {
            return {
                id: sector?.id,
                name: sector.name,
                positions: positions.filter((position: PositionsProps) => position?.sector_id === sector?.id)
            }
        }))
    }

    //Função para resgate de setores ao recarregar a página
    useEffect(() => { getSectorsData() }, [])

    //Faz o delete e atualiza o array de setores
    async function deleteSector(sectorId: number) {
        positions.forEach(async (position: PositionsProps) => {
            if (position.sector_id === sectorId) {
                await api.delete(`/positions/${position?.id}`)
                    .catch()
            }
        })

        let status = await api.delete(`/sectors/${sectorId}`, {
        })
            .then((response) => {

                return 'success'
            })
            .catch((error) => {
                return 'error'
            })
        await getSectorsData()
        return status
    }

    return (
        <SectorsContext.Provider value={{
            getSectorsData,
            setSectors,
            sectors,
            deleteSector,
            sectorToEdit,
            setSectorToEdit,
            positions,
            setPositions
        }}>
            {children}
        </SectorsContext.Provider>
    )
}

function useSectors() {
    return useContext(SectorsContext)
}

export {
    useSectors,
    SectorsProvider
}