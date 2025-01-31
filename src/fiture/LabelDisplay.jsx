import React, { useEffect, useState } from 'react'
import { IoIosCloseCircleOutline } from "react-icons/io";
import '../style/LabelDisplay.css'

const LabelDisplay=({cardId})=> {
    const [selectedLabels, setSelectedLabels] = useState([]);

    useEffect(() => {
        // Retrieve selected labels from localStorage
        const storedSelectedLabels = localStorage.getItem("selectedLabels");
        if (storedSelectedLabels) {
          const parsedSelectedLabels = JSON.parse(storedSelectedLabels);
          if (parsedSelectedLabels[cardId]) {
            setSelectedLabels(parsedSelectedLabels[cardId]);
          }
        }
      }, [cardId]);
    
      const removeLabel = (id) => {
        const storedSelectedLabels = localStorage.getItem("selectedLabels");
        if (storedSelectedLabels) {
          const parsedSelectedLabels = JSON.parse(storedSelectedLabels);
          const updatedSelectedLabels = { ...parsedSelectedLabels };
          updatedSelectedLabels[cardId] = updatedSelectedLabels[cardId].filter((labelId) => labelId !== id);
          
          localStorage.setItem("selectedLabels", JSON.stringify(updatedSelectedLabels));
          setSelectedLabels(updatedSelectedLabels[cardId]);
        }
      };
      return (
        <div className="selected-labels-display">
          {selectedLabels.length === 0 ? (
            <p></p>
          ) : (
            selectedLabels.map((labelId) => {
              const label = JSON.parse(localStorage.getItem("labels")).find((label) => label.id === labelId);
              return (
                <div
                  key={labelId}
                  className="label-item"
                  style={{
                    backgroundColor: label?.bgColor,
                    color: label?.color,
                    padding: "5px",
                    borderRadius: "4px",
                    border:'1px solid #eee',
                    fontWeight: "normal",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width:'fit-content'
                  }}
                >
                  {label?.name}
                  <IoIosCloseCircleOutline onClick={() => removeLabel(labelId)} />
                </div>
              );
            })
          )}
        </div>
      );
}

export default LabelDisplay