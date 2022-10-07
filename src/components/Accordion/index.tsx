import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { useSectors } from '../../hooks/useSectors'
import { SectorProps } from '../SectionContainer'
import { Button } from '@chakra-ui/react'
import { DeleteSectorAlert } from '../Alert'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'

import styles from './styles.module.scss'
interface AccordionProps {
    sector: SectorProps
}

export function AccordionComponent({ sector }: AccordionProps) {
    const { id, name, positions } = sector
    const { deleteSector, setSectorToEdit } = useSectors()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toast = useToast()

    function handleConfirmDeletion() {
        setIsOpen(true)
        setSectorToEdit({} as SectorProps)
    }

    function sendToast(title: string, description: string, status: 'error' | 'success') {
        return toast({
            title,
            description,
            status,
            duration: 4000,
            isClosable: true,
        })
    }

    async function handleDeleteSector() {
        let response = await deleteSector(id!)

        if (response === 'success') {
            sendToast(
                'Sucesso',
                'Setor excluído com sucesso!',
                'success',
            )
        } else {
            sendToast(
                'Erro',
                'Erro ao deletar o setor!',
                'error',
            )
        }

        setIsOpen(false)
    }

    return (
        <>
            <DeleteSectorAlert onDelete={handleDeleteSector} isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <Accordion allowToggle className={styles.accordion}>
                <AccordionItem className={styles.content}>
                    <AccordionButton className={styles.header}>
                        <p>{name}</p>
                        <AccordionIcon className={styles.button} />
                    </AccordionButton>
                    <AccordionPanel>
                        {positions?.length == 0 &&
                            <p>Nenhum cargo cadastrado.</p>
                        }
                        <div className={styles.contentContainer}>
                            {positions?.map((position, key) => (
                                <p key={key}>{position.name}</p>
                            ))}
                        </div>
                        <div className={styles.buttons}>
                            <Button className={styles.editButton} onClick={() => setSectorToEdit(sector)}>Editar</Button>
                            <Button className={styles.deleteButton} onClick={handleConfirmDeletion}>Excluir</Button>
                        </div>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </>
    )
}