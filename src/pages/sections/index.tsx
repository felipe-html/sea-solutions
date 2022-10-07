import { FaBuilding } from 'react-icons/fa'
import { CreateSection } from '../../components/CreateSection'
import { SectionContainer } from '../../components/SectionContainer'

import styles from './styles.module.scss'

export function Sections() {
    return (
        <main className={styles.main}>
            <nav className={styles.nav}>
                <div className={styles.navigationMenu}>
                    <FaBuilding size={30} />
                    <p>Setores</p>
                </div>
            </nav>
            <section className={styles.content}>
                <SectionContainer />
                <CreateSection />
            </section>
        </main>
    )
}