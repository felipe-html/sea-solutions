import { useEffect, useState } from "react";
import { useSectors } from "../../hooks/useSectors";
import { api } from "../../services/api";
import { AccordionComponent } from "../Accordion";

import styles from './styles.module.scss'

export type SectorProps = {
    id?: number,
    name: string,
    positions: PositionsProps[]
}

export type PositionsProps = {
    id: number,
    name: string,
    sector_id?: number
}

export function SectionContainer() {
    const { sectors } = useSectors()

    return (
        <section className={styles.section}>
            <h1>Setores</h1>
            <div className={styles.sectorsContainer}>
                {sectors.map((sector, key) => (
                    <AccordionComponent sector={sector} key={key} />
                ))}
                {sectors.length < 1 &&
                    <p>Nenhum setor encontrado.</p>
                }
            </div>
        </section>
    )
}