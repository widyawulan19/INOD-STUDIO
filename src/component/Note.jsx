import React, { useCallback, useEffect, useState } from 'react'
import { getBoard, createBoard, getListsCountByBoard, updateBoardBackground } from '../services/Api'
import { useNavigate, useParams } from 'react-router-dom';
import { HiChevronRight, HiChevronDown, HiChevronUp } from "react-icons/hi";
import moment from 'moment';
import { Data_Bg } from '../data/DataCover';

const Board = () => {
    const { boardId, workspaceId } = useParams();
    const [boards, setBoards] = useState([]);
    const [newBoard, setNewBoard] = useState({ name: '', description: '' });
    const navigate = useNavigate();
    const [listCount, setListCount] = useState({});
    const [backgroundImage, setBackgroundImage] = useState('');
    const [showBg, setShowBg] = useState(false);
    const [selectBg, setSelectBg] = useState(null);

    // Toggle visibility for background selection
    const toggleBgVisibility = () => {
        setShowBg(!showBg);
    };

    // Handle background selection
    const handleBgSelect = (bg) => {
        setSelectBg(bg);
        setShowBg(false);
    };

    // Load boards
    const loadBoards = useCallback(async () => {
        try {
            const response = await getBoard(workspaceId);
            const filteredBoards = response.data.filter(board => board.workspace_id === Number(workspaceId));
            setBoards(filteredBoards);

            // Fetch list counts for each board
            const listCounts = await Promise.all(filteredBoards.map(async (board) => {
                const listCountResponse = await getListsCountByBoard(board.id);
                return { boardId: board.id, count: listCountResponse.data.list_count };
            }));

            // Map the list counts to the respective board
            const countMap = {};
            listCounts.forEach(({ boardId, count }) => {
                countMap[boardId] = count;
            });
            setListCount(countMap);
        } catch (error) {
            console.error('Failed to load boards', error);
        }
    }, [workspaceId]);

    // Fetch board data when boardId changes
    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const response = await getBoard(boardId);
                setBackgroundImage(response.data.backgroundImageUrl);
            } catch (error) {
                console.error('Error fetching board:', error);
            }
        };

        if (boardId) {
            fetchBoardData();
        }
    }, [boardId]);

    const handleCreateBoard = async () => {
        await createBoard({ ...newBoard, workspace_id: workspaceId });
        loadBoards();
    };

    const handleNavigateToBoardView = (boardId) => {
        navigate(`/workspaces/${workspaceId}/boards/${boardId}`);
    };

    return (
        <div className='board-container' style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none', backgroundSize: 'cover' }}>
            <div className='nav-board'>
                <div className='nav-board2'>
                    <h3 style={{ display: 'flex', textAlign: 'left', color: 'white', marginBottom: '0', margin: '0', width: '20vw', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => navigate('/')} className='btn-nav'>Workspace</button>
                        <HiChevronRight style={{ fontSize: '1.5rem', flexShrink: '0' }} />
                        <button className='btn-nav' style={{ textAlign: 'left' }}>Board</button>
                    </h3>

                    {/* Background selection button */}
                    <button className='btn-bg' onClick={toggleBgVisibility}>
                        {showBg ? <>Background <HiChevronUp /></> : <>Select Background <HiChevronDown /></>}
                    </button>
                    {selectBg && (
                        <span style={{ color: 'white', marginLeft: '10px' }}>Selected: {selectBg.name}</span>
                    )}

                    {/* Background options dropdown */}
                    {showBg && (
                        <div style={{
                            backgroundColor: 'white',
                            border: '0.1px solid grey',
                            borderRadius: '5px',
                            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                            padding: '5px',
                            width: '150px',
                            overflowY: 'auto',
                        }}>
                            {Data_Bg.map((bg) => (
                                <div
                                    className='coverBg'
                                    key={bg.id}
                                    onClick={() => handleBgSelect(bg)}
                                    style={{
                                        marginBottom: '5px',
                                        cursor: 'pointer',
                                        color: 'red',
                                    }}
                                >
                                    <p>{bg.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <h5 style={{ textAlign: 'left', color: 'white', paddingLeft: '10px', margin: '0' }}>Your boards:</h5>
            </div>

            {/* Board list */}
            <div className='board-list-container'>
                <div className='board-list'>
                    {boards.map((board) => (
                        <div key={board.id} className='board-card' onClick={() => handleNavigateToBoardView(board.id)}>
                            <h4>{board.name}</h4>
                            <p>{board.description}</p>
                            <p>{listCount[board.id] || 0} lists</p>
                            <p>{moment(board.create_at).format('D MMMM YYYY')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Board;
