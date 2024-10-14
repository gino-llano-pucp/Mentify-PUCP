import React, { useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import moment from 'moment-timezone';

const FullCalendarEstilizado = ({
  calendarRef,
  mode,
  disponibilidades,
  citas,
  handleCitasEventClick,
  handleDisponibilidadEventClick,
  handleCrearCita,
  handleCrearDisponibilidad,
  handleManejarRedimensionCita,
  handleManejarRedimensionDisponibilidad,
  handleCitaDrop,
  handleDisponibilidadDrop,
  handleSelectAllow,
}) => {
  const divCalendarRef = useRef(null);

  useEffect(() => {
    if (calendarRef.current) {
      modifyColumnHeaders();
      //modifySlotLabels();
    }
  }, []);

  const handleViewDidMount = () => {
    modifyColumnHeaders();
    //modifySlotLabels();
  };

  const modifyColumnHeaders = () => {
    if (document.querySelector('.fc-timeGridWeek-view')) {
      const headerCells = document.querySelectorAll('.fc-col-header-cell-cushion');
      const date = new Date();
      const opciones = { month: 'short', day: '2-digit' };
      const fechaFormateada = date.toLocaleDateString('en-US', opciones);
      const mesEnTexto = fechaFormateada.split(' ')[0];
      const dia = fechaFormateada.split(' ')[1];
      const mesEnNumero = meses[mesEnTexto];
      const fechaFinal = `${parseInt(dia, 10)}/${mesEnNumero}`;

      headerCells.forEach(cell => {
        const text = cell.innerText;
        const [day, date] = text.split(' ');
        const dayWithoutMonth = date.split('/')[0];
        const fullDate = date;
        cell.setAttribute('data-day', day.toUpperCase());
        cell.setAttribute('data-date', dayWithoutMonth);
        if (fechaFinal === fullDate) {
          cell.setAttribute('today', true);
        } else {
          cell.setAttribute('today', false);
        }
        cell.setAttribute('isDayView', false);
      });
    } else if (document.querySelector('.fc-timeGridDay-view')) {
      const headerCell = document.querySelector('.fc-col-header-cell');
      const date = new Date();
      const opciones = { month: 'short', day: '2-digit' };
      const fechaFormateada = date.toLocaleDateString('en-US', opciones);
      const mesEnTexto = fechaFormateada.split(' ')[0];
      const dia = fechaFormateada.split(' ')[1];
      const mesEnNumero = meses[mesEnTexto];
      const fechaFinal = `${parseInt(dia, 10)}/${mesEnNumero}`;
      const dateAttr = headerCell.getAttribute('data-date');
      const cellDate = new Date(dateAttr);
      const cellCushion = headerCell.querySelector('.fc-col-header-cell-cushion');
      cellCushion.setAttribute('data-day', cellCushion.innerText);
      cellCushion.setAttribute('isDayView', true);
    }
  };

  const modifySlotLabels = () => {
    console.log("mod slot labels.");
    const slotLabels = document.querySelectorAll('.fc-timegrid-slot-label-cushion');
    slotLabels.forEach(label => {
      let text = label.innerText.trim();
      //console.log("slot: ", text);
      text = text.replace('a. m.', 'AM').replace('p. m.', 'PM');
      let modifiedText = '';
      let detected = false;
      for (let i = 0; i < text.length; i++) {
        modifiedText += text[i];
        if (i > 0 && !isNaN(text[i]) && isNaN(text[i - 1])) {
          detected = true;
          break;
        }
      }
      if (!detected) {
        label.innerText = modifiedText.trim();
      } else {
        label.innerText = modifiedText.slice(0, -1);
      }
      //console.log("modified text: ", modifiedText);
      console.log("inner text: ", label.innerText);
    });
  };

  const modifySlotLabelsDay = () => {
    const slotLabels = document.querySelectorAll('.fc-timegrid-slot-label-cushion');
    slotLabels.forEach(label => {
      let text = label.innerText.trim();
      const match = text.match(/(\d{1,2}(:\d{2})?\s*[ap]\.?m\.?)/i);
      if (match) {
        let formattedText = match[0].replace(/\./g, '').replace(/\s*a\s*m/i, ' AM').replace(/\s*p\s*m/i, ' PM');
        label.innerText = formattedText;
      }
    });
  };

  useEffect(() => {
    const calendarNode = divCalendarRef.current;
    if (!calendarNode) return;

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const targetElement = mutation.target;
          if (targetElement.classList.contains('fc-timeGridWeek-view')) {
            modifyColumnHeaders();
            //modifySlotLabels();
          } else if (targetElement.classList.contains('fc-timeGridDay-view')) {
            modifyColumnHeaders();
            //modifySlotLabelsDay();
          }

          if (targetElement.querySelector('.fc-col-header-cell.fc-day.fc-day-sun')) {
            // Realizar acción deseada aquí
          }

          /* if (targetElement.classList.contains('fc-timegrid-slot-label-cushion')) {
            modifySlotLabels();
          } */

          const buttonGroupNode = calendarNode.querySelector('.fc-button-group');
          if (buttonGroupNode) {
            const prevButton = buttonGroupNode.querySelector('.fc-prev-button');
            const nextButton = buttonGroupNode.querySelector('.fc-next-button');
            const todayButton = buttonGroupNode.querySelector('.fc-today-button');

            const handleButtonClick = (event) => {
              modifyColumnHeaders();
            };

            if (prevButton) {
              prevButton.addEventListener('click', handleButtonClick);
            }

            if (nextButton) {
              nextButton.addEventListener('click', handleButtonClick);
            }

            if (todayButton) {
              todayButton.addEventListener('click', handleButtonClick);
            }
          }
        }
      }
    });

    observer.observe(calendarNode, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class'],
    });
  }, []);

  const meses = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12
  };

  return (
    <div ref={divCalendarRef}>
      <FullCalendar
        nowIndicator={true}
        slotMinTime={"07:00:00"}
        slotMaxTime={"22:00:00"}
        slotLabelFormat={{
          hour: 'numeric',
          omitZeroMinute: true,
          hour12: true,
          meridiem: 'short'
        }}
        allDaySlot={false}
        locale={esLocale}
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView='timeGridWeek'
        headerToolbar={{
          left: 'prev,next,today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        views={{
          timeGridWeek: {
            titleFormat: { year: 'numeric', month: 'long' }
          }
        }}
        editable={mode !== 'visualizarCitas'}
        eventStartEditable={mode !== 'visualizarCitas'}
        eventResizableFromStart={mode !== 'visualizarCitas'}
        eventDurationEditable={mode !== 'visualizarCitas'}
        events={[...disponibilidades, ...citas]}
        eventClick={mode === 'visualizarCitas' || mode === 'registrarCita' ? handleCitasEventClick : handleDisponibilidadEventClick}
        selectable={mode !== 'visualizarCitas'}
        selectMirror={true}
        select={mode === 'registrarCita' ? handleCrearCita : handleCrearDisponibilidad}
        eventResize={mode === 'registrarCita' ? handleManejarRedimensionCita : handleManejarRedimensionDisponibilidad}
        eventDrop={mode === 'registrarCita' ? handleCitaDrop : handleDisponibilidadDrop}
        selectAllow={handleSelectAllow}
        viewDidMount={handleViewDidMount}
      />
    </div>
  );
};

export default FullCalendarEstilizado;
