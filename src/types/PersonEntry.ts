interface PersonEntry {
    id: string;
    name: string;
    confirmed: boolean;
    type: 'guest' | 'companion';
    guestId?: string; // ID del invitado principal si es acompañante
    guestName?: string; // Nombre del invitado principal si es acompañante
}

export default PersonEntry;