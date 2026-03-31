export function PersonTag({ name, onRemove, clickable, onClick }) {
    const handleClick = () => {
        if (clickable && onClick) {
            onClick(name);
        }
    };

    return (
        <span
            className={`person-tag ${clickable ? "clickable" : ""}`}
            onClick={handleClick}
        >
            {name}
            {onRemove && (
                <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    onRemove(name);
                }}>
                    ×
                </button>
            )}
        </span>
    );
}
