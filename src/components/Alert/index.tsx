import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react'
import { RefObject } from 'react'
import { Button } from '@chakra-ui/react'

interface DeleteSectorAlertProps {
    isOpen: boolean,
    onClose: () => void,
    onDelete: () => void
}

export function DeleteSectorAlert({ isOpen, onClose, onDelete }: DeleteSectorAlertProps) {
    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={{} as RefObject<any>}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Excluir setor
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Tem certeza que deseja excluir este setor?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button onClick={onDelete} colorScheme='red' ml={3}>
                            Excluir
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}