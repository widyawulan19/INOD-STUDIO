import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkspaceById } from '../api'; // Pastikan path sesuai

const Board = () => {
    const { boardId, workspaceId } = useParams();
    const [workspace, setWorkspace] = useState(null);

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                const response = await getWorkspaceById(workspaceId);
                setWorkspace(response.data); // Sesuaikan dengan struktur respons API
            } catch (error) {
                console.error('Gagal mengambil data workspace:', error);
            }
        };

        if (workspaceId) {
            fetchWorkspace();
        }
    }, [workspaceId]);

    return (
        <div>
            <h1>Board Page</h1>
            {workspace ? (
                <div>
                    <h2>{workspace.name}</h2>
                    <p>{workspace.description}</p>
                </div>
            ) : (
                <p>Loading workspace...</p>
            )}
        </div>
    );
};

export default Board;
