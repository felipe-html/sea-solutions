import { createContext, ReactNode, useContext, Dispatch, SetStateAction, useState, useEffect } from 'react'
import { PositionsProps, SectorProps } from '../components/SectionContainer'
import { api } from '../services/api'

interface UseSectorsProps {
    children: ReactNode
}

interface SectorsContextData {
    sectors: SectorProps[]
    getSectorsData: () => void
    sendNewSector: (sector: SectorProps) => Promise<string>
    deleteSector: (sectorId: number) => Promise<string>
    updateSector: (sector: SectorProps) => Promise<string>
    sectorToEdit: SectorProps
    setSectorToEdit: Dispatch<SetStateAction<SectorProps>>
    positions: PositionsProps[]
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

    //Validação de existência de outro setor com o nome enviado por parâmetro
    async function verifySector(sectorName: string) {
        let sectorAlreadyExists = sectors.find((item) => item.name.toLowerCase() == sectorName.toLowerCase())
        return sectorAlreadyExists
    }

    //Faz o post e atualiza o array de setores
    async function sendNewSector(sector: SectorProps) {
        let status = ''

        let sectorAlreadyExists = await verifySector(sector.name)

        if (sectorAlreadyExists) {
            status = 'sector-exists'
            return status
        }

        await api.post(`/sectors`, {
            name: sector.name,
        })
            .then((response) => {
                status = 'success'
                sector.id = response.data?.id
            })
            .catch((error) => {
                status = 'error'
            })

        if (status === 'error' || sector.positions.length === 0) {
            getSectorsData()
            return status
        }

        sector.positions.forEach(async (position) => {
            await api.post(`/positions`, {
                name: position.name,
                sector_id: sector?.id
            })
                .catch()
        })

        await getSectorsData()
        return status
    }

    //Faz o put e atualiza o array de setores
    async function updateSector(sector: SectorProps) {
        let status = ''
        let sectorAlreadyExists = await verifySector(sector.name)

        if (sectorAlreadyExists && sector?.id !== sectorAlreadyExists?.id) {
            status = 'sector-exists'
            return status
        }

        await api.put(`/sectors/${sector?.id!}`, {
            name: sector.name,
        })
            .then((response) => {
                return response.data
            })
            .catch()

        let allPositions = await api.get(`/positions`)
            .then((response) => {
                return response.data
            })
            .catch()

        allPositions.forEach(async (position: PositionsProps) => {
            if (position.sector_id === sector?.id) {
                await api.delete(`/positions/${position?.id}`).catch()
            }
        })

        sector.positions.forEach(async (position: PositionsProps) => {
            await api.post(`/positions`, {
                name: position.name,
                sector_id: sector.id
            })
                .catch()
        })

        await getSectorsData()
        return 'success'
    }

    //Faz o delete e atualiza o array de setores
    async function deleteSector(sectorId: number) {
        let allPositions = await api.get(`/positions`)
            .then((response) => {
                return response.data
            })
            .catch()

        allPositions.forEach(async (position: PositionsProps) => {
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
            sectors,
            sendNewSector,
            deleteSector,
            sectorToEdit,
            setSectorToEdit,
            updateSector,
            positions
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