import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../css/calendar.css';
import Header from './header';

Modal.setAppElement('#root');

function Calendar() {

    const navigate = useNavigate()

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [viewEventModalIsOpen, setViewEventModalIsOpen] = useState(false);
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventColor, setEventColor] = useState('green');
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/events')
            .then(response => setEvents(response.data))
            .catch(error => console.error('Error al cargar los eventos:', error));
    }, []);

    const handleDateClick = (arg) => {
        setEventDate(arg.dateStr);
        openModal();
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        resetEventForm();
    };

    const openViewEventModal = () => {
        setViewEventModalIsOpen(true);
    };

    const closeViewEventModal = () => {
        setViewEventModalIsOpen(false);
    };

    const openConfirmDeleteModal = () => {
        setConfirmDeleteModalIsOpen(true);
    };

    const closeConfirmDeleteModal = () => {
        setConfirmDeleteModalIsOpen(false);
    };

    const resetEventForm = () => {
        setSelectedEvent(null);
        setEventTitle('');
        setEventDescription('');
        setEventDate('');
        setEventColor('green');
    };

    const handleSaveEvent = () => {
        if (selectedEvent) {
            const updatedEvent = {
                id: selectedEvent.id,
                title: eventTitle,
                start: eventDate,
                description: eventDescription,
                color: eventColor
            };

            axios.put(`http://localhost:3001/events/${selectedEvent.id}`, updatedEvent)
                .then(response => {
                    setEvents(events.map(event =>
                        event.id === selectedEvent.id ? response.data : event
                    ));
                    closeModal();
                })
                .catch(error => console.error('Error al editar el evento:', error));
        } else {
            const newEvent = {
                id: uuidv4(),
                title: eventTitle,
                start: eventDate,
                description: eventDescription,
                color: eventColor
            };

            axios.post('http://localhost:3001/events', newEvent)
                .then(response => {
                    setEvents([...events, response.data]);
                    closeModal();
                })
                .catch(error => console.error('Error al crear el evento:', error));
        }
    };

    const handleEventClick = (info) => {
        const clickedEvent = events.find(event => event.id === info.event.id);
        setSelectedEvent(clickedEvent);
        setEventTitle(clickedEvent.title);
        setEventDescription(clickedEvent.description);
        setEventDate(clickedEvent.start);
        setEventColor(clickedEvent.color);
        openViewEventModal();
    };

    const handleDeleteEvent = () => {
        axios.delete(`http://localhost:3001/events/${selectedEvent.id}`)
            .then(() => {
                setEvents(events.filter(event => event.id !== selectedEvent.id));
                closeConfirmDeleteModal();
                closeViewEventModal();
            })
            .catch(error => console.error('Error al eliminar el evento:', error));
    };

    const handleEditEvent = () => {
        openModal();
        closeViewEventModal();
    };

    const eventContent = (eventInfo) => {
        return (
            <>
                <b style={{ color: eventInfo.event.textColor }}>{eventInfo.timeText}</b><br />
                {eventInfo.event.title}
            </>
        );
    };

    return (
        <div className='full-container'>
            <Header />
          <div className='container-calendar'>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Plugins que se usarán en el calendario
                initialView='dayGridMonth' // Vista inicial del calendario
                headerToolbar={{
                    start: 'prev,today,next', // Botones al inicio del toolbar
                    center: 'title', // Título centrado
                    end: 'dayGridMonth,timeGridWeek,timeGridDay' // Botones al final del toolbar
                }}
                height={'95vh'} // Altura del calendario
                dateClick={handleDateClick} // Evento que se ejecuta al hacer clic en una fecha
                events={events} // Eventos a mostrar en el calendario
                eventContent={eventContent} // Renderizador del contenido del evento
                eventClick={handleEventClick} // Evento que se ejecuta al hacer clic en un evento
            />

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="modal-creation-event"
                overlayClassName="overlay1"
            >
                <h2>{selectedEvent ? 'Editar Evento' : 'Crear Evento'}</h2>
                <label className='titulo'>Título del Evento:</label>
                <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                <label className='descripcion'>Descripción del Evento:</label>
                <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
                <label className='color'>Color del Evento:</label>
                <select value={eventColor} onChange={(e) => setEventColor(e.target.value)}>
                    <option value="" disabled>Selecciona un color</option>
                    
                    <option value="#07A128">Verde</option>
                    <option value="#900C3F">Rosa</option>
                    <option value="#581845">Morado</option>
                    <option value="#07A193">Azul</option>
                </select>
                <p className='fecha'>Fecha seleccionada: {eventDate}</p>
                <div>
                    <button className='guardar' onClick={handleSaveEvent}>{selectedEvent ? 'Guardar Cambios' : 'Guardar Evento'}</button>
                    <button className='cancelar' onClick={closeModal}>Cancelar</button>
                </div>
            </Modal>

            <Modal
                isOpen={viewEventModalIsOpen}
                onRequestClose={closeViewEventModal}
                className="modal-view-event"
                overlayClassName="overlay1"
            >
                <h2>Detalles del Evento</h2>
                <p><strong>Título:</strong> {selectedEvent?.title}</p>
                <p><strong>Descripción:</strong> {selectedEvent?.description}</p>
                <p><strong>Fecha:</strong> {selectedEvent?.start}</p>
                <div className="button-container">
                    <button onClick={handleEditEvent}>Editar Evento</button>
                    <button onClick={openConfirmDeleteModal}>Eliminar Evento</button>
                    <button onClick={closeViewEventModal}>Cerrar</button>
                </div>
            </Modal>

            <Modal
                isOpen={confirmDeleteModalIsOpen}
                onRequestClose={closeConfirmDeleteModal}
                className="modal-confirm-delete"
                overlayClassName="overlay1"
            >
                <h2>Confirmar Eliminación</h2>
                <p>¿Estás seguro de que deseas eliminar el evento "{selectedEvent?.title}"?</p>
                <div className="button-container">
                    <button onClick={handleDeleteEvent}>Sí</button>
                    <button onClick={closeConfirmDeleteModal}>Cancelar</button>
                </div>
            </Modal>
            </div>
        </div>
    );
}

export default Calendar;