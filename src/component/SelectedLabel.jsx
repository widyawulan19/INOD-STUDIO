import React, { useEffect, useState } from 'react';
import { useDate } from '../context/DateContext';

const SelectedLabel = ({ cardId }) => {
    const { labels } = useDate();
    const [filteredLabels, setFilteredLabels] = useState([]);

    useEffect(() => {
        if (labels) {
            // Filter label berdasarkan card_id yang sama
            const labelsForCard = labels.filter(label => label.card_id === cardId);
            setFilteredLabels(labelsForCard);
        }
    }, [cardId, labels]);

    return (
        <div>
            <h4>Labels for Card {cardId}:</h4>
            {filteredLabels.length > 0 ? (
                <ul>
                    {filteredLabels.map((label) => (
                        <li key={label.id} style={{ backgroundColor: label.bg_color || 'white' }}>
                            {label.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No labels found for this card.</p>
            )}
        </div>
    );
};

export default SelectedLabel;
