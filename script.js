async function loadTimeline() {
    const container = document.getElementById('timeline-container');

    try {
        const response = await fetch('Cleansed_Events.csv');
        const data = await response.text();

        const rows = data.split('\n').filter(row => row.trim() !== '');
        const bodyRows = rows.slice(1);

        container.innerHTML = ''; 

        bodyRows.forEach((row, index) => {
            const columns = row.split(',');
            
            const year = columns[0].trim();
            const month = columns[1].trim();
            const day = columns[2].trim();
            const eventText = columns.slice(3).join(',').trim();

            // Create the <section> wrapper
            const section = document.createElement('section');

            section.innerHTML = `
                <div class="section-title">${year}</div>
                <div class="section-content">
                    <article>
                        <aside>
                            <div class="dot"></div>
                            ${index !== bodyRows.length - 1 ? '<div class="line"></div>' : ''}
                        </aside>
                        <main>
                            <div class="timeline-date">${month}. ${day}.</div>
                            <div class="timeline-event">${eventText}</div>
                        </main>
                    </article>
                </div>
            `;

            container.appendChild(section);
        });
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p>Hiba történt a betöltés során.</p>';
    }
}

loadTimeline();