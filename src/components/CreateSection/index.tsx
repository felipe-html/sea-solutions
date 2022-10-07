import { AccordionComponent } from "../Accordion";
import { Input } from '@chakra-ui/react'
import styles from './styles.module.scss'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { useEffect, useState } from "react";
import { PositionsProps, SectorProps } from "../SectionContainer";
import { useSectors } from "../../hooks/useSectors";
import { Routes, Route, useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'
import { useDispatch } from "react-redux";
import { api } from "../../services/api";

type PostProps = {
    id: number,
    name: string
}

export function CreateSection() {
    const [name, setName] = useState<string>('')
    const [currentPost, setCurrentPost] = useState<string>('')
    const [posts, setPosts] = useState<PostProps[]>([])
    const toast = useToast()

    const { sendNewSector, updateSector, sectorToEdit, setSectorToEdit, positions } = useSectors()

    function getData() {
        setName(sectorToEdit.name)
        setPosts(sectorToEdit.positions)
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
        setPosts([])
    }

    //Verifica se já existe um cargo com esse nome em outro setor
    async function verifyPosition(positionName: string) {
        let sectorAlreadyExists = positions.find((item) => item.name.toLowerCase() == positionName.toLowerCase())
        return sectorAlreadyExists
    }

    async function handleRegisterNewSection() {
        if (name === '') {
            return toast({
                title: 'Campo obrigatório*',
                description: "O setor precisa de um nome.",
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }

        let newSector = {
            id: sectorToEdit?.id || null,
            name,
            positions: [...posts]
        } as SectorProps

        let status = ''

        if (sectorToEdit?.id) {
            status = await updateSector(newSector)
        } else {
            status = await sendNewSector(newSector)
        }

        let title = ''
        let description = ''

        switch (status) {
            case 'success':
                title = 'Sucesso!'
                description = 'Setor criado com sucesso!'
                setSectorToEdit({} as SectorProps)
                resetFields()
                break;

            case 'error':
                title = 'Erro!'
                description = 'Desculpe! Houve um erro ao tentar criar um novo setor!'
                break;

            case 'sector-exists':
                title = 'Erro!'
                description = 'Este setor já existe.'
                break;
        }

        toast({
            title,
            description,
            status: status === 'success' ? 'success' : 'error',
            duration: 4000,
            isClosable: true,
        })
    }

    async function handleRegisterNewPost() {
        if (currentPost === '')
            return

        let positionAlreadyExists = await verifyPosition(currentPost)

        if (positionAlreadyExists) {

            if (sectorToEdit?.id !== positionAlreadyExists?.sector_id) {

                return toast({
                    title: 'Este cargo já existe!',
                    description: 'O cargo já está relacionado a outro setor.',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            }
        }

        setPosts(oldValue => {
            return [...oldValue, { id: oldValue[oldValue.length - 1]?.id + 1, name: currentPost }]
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
                {posts.length > 0 ? (
                    <p>Cargos:</p>

                ) : (
                    <p>Nenhum cargo adicionado.</p>
                )}

                <div className={styles.postsContainer}>
                    {posts.map((item) => (
                        <p
                            title='Clique para remover'
                            onClick={() => {
                                setPosts(oldValue => {
                                    return oldValue.filter(post => post?.id !== item?.id)
                                })
                            }}
                            className={styles.post}
                            key={item?.id}
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
                <Button className={styles.saveButton} onClick={handleRegisterNewSection}>Salvar</Button>
            </div>
        </section>
    )
}