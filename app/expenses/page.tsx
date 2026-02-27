'use client';

import { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, Receipt, TrendingUp, Calculator, Loader2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import FamilyLock from '@/components/FamilyLock';

const PARTICIPANTS = [
    'Abuela Rosy', 'Fede', 'Marimar', 'Ale', 'Majo', 'Alo', 'Veros',
    'Mariela', 'Rafa', 'Ceci', 'Andrés', 'Luis', 'Elvira'
];

interface Expense {
    id: string;
    payer: string;
    amount: number;
    concept: string;
    created_at: string;
}

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newExpense, setNewExpense] = useState({
        payer: '',
        amount: '',
        concept: ''
    });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setExpenses(data as Expense[]);
        }
        setIsLoading(false);
    };

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newExpense.payer || !newExpense.amount || !newExpense.concept) return;

        setIsSaving(true);
        const { error } = await supabase
            .from('expenses')
            .insert([{
                payer: newExpense.payer,
                amount: parseFloat(newExpense.amount),
                concept: newExpense.concept
            }]);

        if (!error) {
            setNewExpense({ payer: '', amount: '', concept: '' });
            setShowForm(false);
            fetchExpenses();
        } else {
            console.error(error);
            alert('Error: Asegúrate de crear la tabla "expenses" en Supabase con columnas id, payer, amount, concept.');
        }
        setIsSaving(false);
    };

    const deleteExpense = async (id: string) => {
        if (confirm('¿Borrar este gasto?')) {
            const { error } = await supabase.from('expenses').delete().eq('id', id);
            if (!error) fetchExpenses();
        }
    };

    const calculateBalances = () => {
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const share = total / PARTICIPANTS.length;

        const paidByEach = PARTICIPANTS.reduce((acc, name) => {
            acc[name] = expenses
                .filter(exp => exp.payer === name)
                .reduce((sum, exp) => sum + exp.amount, 0);
            return acc;
        }, {} as Record<string, number>);

        return PARTICIPANTS.map(name => ({
            name,
            paid: paidByEach[name],
            balance: paidByEach[name] - share
        })).sort((a, b) => b.balance - a.balance);
    };

    const balances = calculateBalances();
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <FamilyLock>
            <div className="section-bg" style={{ backgroundImage: 'url(/madrid_luxury_room.png)' }}></div>
            <div className={`content-wrapper ${styles.expensesPage}`}>
                <div className="container">
                    <header className={styles.header}>
                        <h1 className="text-madrid-gradient">Gastos <span className="text-gold">Compartidos</span></h1>
                        <p>¿Quién pagó qué? Aquí llevamos las cuentas para que no haya líos al final.</p>
                    </header>

                    <div className={styles.statsGrid}>
                        <div className={`${styles.statCard} glass`}>
                            <TrendingUp className={styles.statIcon} />
                            <div className={styles.statInfo}>
                                <span>Total Gastado</span>
                                <h3>{totalSpent.toFixed(2)}€</h3>
                            </div>
                        </div>
                        <div className={`${styles.statCard} glass`}>
                            <Users className={styles.statIcon} />
                            <div className={styles.statInfo}>
                                <span>Por Persona ({PARTICIPANTS.length})</span>
                                <h3>{(totalSpent / PARTICIPANTS.length).toFixed(2)}€</h3>
                            </div>
                        </div>
                    </div>

                    <div className={styles.mainGrid}>
                        {/* Summary Column */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Calculator size={20} />
                                <h2>Balance Final</h2>
                            </div>
                            <div className={`${styles.balanceList} glass`}>
                                {balances.map((item) => (
                                    <div key={item.name} className={styles.balanceItem}>
                                        <span className={styles.personName}>{item.name}</span>
                                        <div className={styles.amountInfo}>
                                            <span className={styles.paidLabel}>Pagó: {item.paid.toFixed(2)}€</span>
                                            <span className={`${styles.balanceValue} ${item.balance >= 0 ? styles.positive : styles.negative}`}>
                                                {item.balance >= 0 ? `+${item.balance.toFixed(2)}` : `${item.balance.toFixed(2)}`}€
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* History Column */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Receipt size={20} />
                                <h2>Historial de Pagos</h2>
                                <button className="btn-primary-blue" onClick={() => setShowForm(!showForm)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                    {showForm ? 'Cerrar' : <><Plus size={16} /> Añadir Gasto</>}
                                </button>
                            </div>

                            {showForm && (
                                <form className={`${styles.addForm} glass`} onSubmit={handleAddExpense}>
                                    <select
                                        value={newExpense.payer}
                                        onChange={e => setNewExpense({ ...newExpense, payer: e.target.value })}
                                        required
                                    >
                                        <option value="">¿Quién pagó?</option>
                                        {PARTICIPANTS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Monto (€)"
                                        value={newExpense.amount}
                                        onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Concepto (Ej. Taxis, Cena...)"
                                        value={newExpense.concept}
                                        onChange={e => setNewExpense({ ...newExpense, concept: e.target.value })}
                                        required
                                    />
                                    <button type="submit" className="btn-primary-blue" disabled={isSaving}>
                                        {isSaving ? <Loader2 className="animate-spin" /> : 'Registrar Gasto'}
                                    </button>
                                </form>
                            )}

                            <div className={styles.expensesList}>
                                {isLoading ? (
                                    <Loader2 className="animate-spin mx-auto mt-10" size={32} />
                                ) : (
                                    expenses.map((exp) => (
                                        <div key={exp.id} className={`${styles.expenseCard} glass`}>
                                            <div className={styles.expenseMain}>
                                                <h3>{exp.concept}</h3>
                                                <span className={styles.expenseMeta}>Pagado por <strong>{exp.payer}</strong></span>
                                            </div>
                                            <div className={styles.expenseRight}>
                                                <span className={styles.expenseAmount}>{exp.amount.toFixed(2)}€</span>
                                                <button onClick={() => deleteExpense(exp.id)} className={styles.btnDelete}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </FamilyLock>
    );
}
