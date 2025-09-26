import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableSkill = ({ id, isRequired }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '8px 15px',
        margin: '4px',
        borderRadius: '20px',
        cursor: 'grab',
        display: 'inline-block',
        backgroundColor: isRequired ? '#d1fae5' : '#e0e7ff',
        color: isRequired ? '#065f46' : '#4338ca',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {id}
        </div>
    );
};
