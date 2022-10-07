import { Input } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { useEffect, useState } from "react";
import { PositionsProps, SectorProps } from "../SectionContainer";
import { useSectors } from "../../hooks/useSectors";
import { useToast } from '@chakra-ui/react'
import { api } from '../../services/api';

import styles from './styles.module.scss'

export function CreateSection() {
    const [name, setName] = useState<string>('')
    const [currentPost, setCurrentPost] = useState<string>('')
    const [newPositions, setNewPositions] = useState<PositionsProps[]>([])

    const { sectorToEdit, setSectorToEdit, positions, sectors, setSectors, setPositions, getSectorsData } = useSectors()
    const toast = useToast()

    function getData() {
        setName(sectorToEdit.name)
        setNewPositions(sectorToEdit.positions)
    }

    useEffect(() => {
        if (sectorToEdit?.id) {
            getData()
        } else {
            resetFields()
        }
    }, [sectorToEdit])

    function resetFields() {
        setName('')
        setCurrentPost('')
        setNewPositions([])
    }

    function sendToast(title: string, description: string, status: 'error' | 'success') {
        toast({
            title,
            description,
            status,
            duration: 4000,
            isClosable: true,
        })
    }

    //Verifica se já existe um cargo com esse nome em outro setor
    async function verifyPosition(positionName: string) {
        if (positions.length === 0)
            return undefined
        let sectorAlreadyExists = positions.find((item) => item.name.toLowerCase() == positionName.toLowerCase())
        return sectorAlreadyExists
    }

    async function verifySector(sectorName: string) {
        if (sectors.length === 0)
            return undefined
        let sectorAlreadyExists = sectors.find((item) => item.name.toLowerCase() == sectorName.toLowerCase())
        return sectorAlreadyExists
    }

    async function handleRegisterNewSector() {
        if (name === '') {
            return sendToast(
                'Campo obrigatório*',
                "O setor precisa de um nome.",
                'error',
            )
        }

        let sectorAlreadyExists = await verifySector(name)

        if (sectorAlreadyExists) {
            return sendToast(
                'Erro',
                'Este setor já existe.',
                'error'
            )
        }

        let sectorId = await api.post(`/sectors`, {
            name: name,
        })
            .then((response) => {
                setSectors(oldValue => {
                    let newValue = {
                        id: response.data?.id,
                        name: response.data.name,
                        positions: []
                    }
                    return [...oldValue, newValue]
                })
                return response.data.id
            })
            .catch((error) => {
                return 0
            })

        if (sectorId === 0) {
            return sendToast(
                'Erro',
                'Houve um erro ao tentar criar o setor.',
                'error'
            )
        }

        newPositions.forEach(async (position) => {
            await api.post(`/positions`, {
                name: position.name,
                sector_id: sectorId
            })
                .then((response) => {
                    setPositions(oldValue => {
                        return [...oldValue, response.data]
                    })
                })
                .catch((error) => {
                    sendToast(
                        'Erro',
                        `Houve um erro ao tentar criar o cargo ${position.name}`,
                        'error'
                    )
                })
        })

        sendToast(
            'Criado!',
            'Setor criado com sucesso!',
            'success'
        )

        resetFields()

        await getSectorsData()
    }

    async function handleUpdateSector() {
        if (name === '') {
            return sendToast(
                'Campo obrigatório*',
                "O setor precisa de um nome.",
                'error',
            )
        }

        let sectorAlreadyExists = await verifySector(name)

        if (sectorAlreadyExists && sectorToEdit.id !== sectorAlreadyExists?.id) {
            return sendToast(
                'Erro!',
                'Este setor já existe.',
                'error'
            )
        }

        let id = await api.put(`/sectors/${sectorToEdit?.id!}`, {
            name: name,
        })
            .then((response) => {
                return response.data.id
            })
            .catch((err0r) => {
                return 0
            })

        if (id === 0) {
            return sendToast(
                'Erro!',
                'Este departamento já existe.',
                'error'
            )
        }

        //Verifica os cargos que foram excluídos
        newPositions.forEach(async (position) => {
            if (!position.id) {
                await api.post(`/positions`, {
                    name: position.name,
                    sector_id: id
                })
            }
        })

        //Adiciona os novos cargos
        positions.forEach(async (position) => {
            if (position.sector_id !== id) {
                return
            }

            let positionWasNotDeleted = newPositions.find(item => item?.id === position?.id)
            console.log(positionWasNotDeleted)
            if (!positionWasNotDeleted) {
                await api.delete(`/positions/${position?.id}`)
                    .catch((error) => {
                    })
            }
        })

        await getSectorsData()
        resetFields()
        sendToast(
            'Sucesso!',
            'O setor foi atualizado com sucesso!',
            'success'
        )
    }

    async function handleRegisterNewPost() {
        if (currentPost === '')
            return

        let positionAlreadyExists = await verifyPosition(currentPost)

        if (positionAlreadyExists) {

            return sendToast(
                'Este cargo já existe!',
                'O cargo já existe.',
                'error'
            )
        }

        setNewPositions(oldValue => {
            return [...oldValue, { name: currentPost }]
        })

        setCurrentPost('')
    }

    function handleCancelEdit() {
        setSectorToEdit({} as SectorProps)
        resetFields()
    }

    return (
        <section className={styles.section}>
            <h1>{sectorToEdit?.id ? 'Editar ' + sectorToEdit.name : 'Adicionar setor'}</h1>
            <div className={styles.container}>
                <div className={styles.inputContainer}>
                    <label htmlFor="">Nome*</label>
                    <Input
                        value={name}
                        onChange={(event) =>
                            setName(event.currentTarget.value)}
                        placeholder='Nome do setor'
                    />
                </div>
                <div className={styles.postInput}>
                    <label htmlFor="">Cargo</label>
                    <div>
                        <Input
                            onKeyUp={(event) => event.key === 'Enter' && handleRegisterNewPost()}
                            id='post-add' value={currentPost}
                            onChange={(event) => setCurrentPost(event.currentTarget.value)}
                            placeholder='Nome do cargo'
                        />
                        <Button className={styles.button} onClick={handleRegisterNewPost}>Adicionar</Button>
                    </div>
                </div>
                {newPositions.length > 0 ? (
                    <p>Cargos:</p>

                ) : (
                    <p>Nenhum cargo adicionado.</p>
                )}

                <div className={styles.postsContainer}>
                    {newPositions.map((item, key) => (
                        <p
                            title='Clique para remover'
                            onClick={() => {
                                setNewPositions(oldValue => {
                                    return oldValue.filter(post => post?.id !== item?.id)
                                })
                            }}
                            className={styles.post}
                            key={key}
                        >
                            {item.name}
                        </p>
                    ))}
                </div>
            </div>
            <div className={styles.footer}>
                {sectorToEdit?.id &&
                    <Button onClick={handleCancelEdit}>Cancelar</Button>
                }
                <Button className={styles.saveButton} onClick={() => sectorToEdit.id ? handleUpdateSector() : handleRegisterNewSector()}>Salvar</Button>
            </div>
        </section>
    )
}