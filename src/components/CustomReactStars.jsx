import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// This is a custom implementation of ReactStars that doesn't use defaultProps
// but instead uses JavaScript default parameters to avoid the React warning
const CustomReactStars = ({
  count = 5,
  value = 0,
  size = 24,
  edit = true,
  isHalf = false,
  emptyIcon = "☆",
  halfIcon = "½",
  filledIcon = "★",
  activeColor = "#ffd700",
  color = "#000000",
  onChange = () => {},
  a11y = true,
  classNames = "",
  char = null
}) => {
  const [stars, setStars] = useState([]);
  const [hoverValue, setHoverValue] = useState(0);

  useEffect(() => {
    const starsArray = Array.from({ length: count }, (_, index) => {
      const starValue = index + 1;
      const isActive = value >= starValue;
      const isActiveHalf = isHalf && Math.ceil(value) === starValue && value !== starValue;
      
      return {
        value: starValue,
        isActive,
        isActiveHalf
      };
    });
    
    setStars(starsArray);
  }, [count, value, isHalf]);

  const handleMouseMove = (event, starValue) => {
    if (!edit) return;
    
    const { clientX } = event;
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const position = (clientX - left) / width;
    
    if (isHalf && position <= 0.5) {
      setHoverValue(starValue - 0.5);
    } else {
      setHoverValue(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!edit) return;
    setHoverValue(0);
  };

  const handleClick = (starValue, event) => {
    if (!edit) return;
    
    if (isHalf) {
      const { clientX } = event;
      const { left, width } = event.currentTarget.getBoundingClientRect();
      const position = (clientX - left) / width;
      
      if (position <= 0.5) {
        onChange(starValue - 0.5);
      } else {
        onChange(starValue);
      }
    } else {
      onChange(starValue);
    }
  };

  const renderStar = (star) => {
    const isHovered = hoverValue >= star.value;
    const isHoveredHalf = isHalf && Math.ceil(hoverValue) === star.value && hoverValue !== star.value;
    
    // Determine which icon to show
    let icon;
    if (hoverValue && isHovered) {
      icon = filledIcon;
    } else if (hoverValue && isHoveredHalf) {
      icon = halfIcon;
    } else if (star.isActive) {
      icon = filledIcon;
    } else if (star.isActiveHalf) {
      icon = halfIcon;
    } else {
      icon = emptyIcon;
    }
    
    // Use custom character if provided
    if (char) {
      icon = char;
    }
    
    // Determine color
    const starColor = (isHovered || isHoveredHalf || star.isActive || star.isActiveHalf) ? activeColor : color;
    
    return (
      <span
        key={star.value}
        style={{
          color: starColor,
          fontSize: `${size}px`,
          cursor: edit ? 'pointer' : 'default',
          padding: '0 2px'
        }}
        onClick={(e) => handleClick(star.value, e)}
        onMouseMove={(e) => handleMouseMove(e, star.value)}
        onMouseLeave={handleMouseLeave}
        role={a11y ? "button" : undefined}
        aria-label={a11y ? `${star.value} stars` : undefined}
        tabIndex={a11y ? 0 : undefined}
      >
        {icon}
      </span>
    );
  };

  return (
    <div className={`react-stars ${classNames}`} style={{ display: 'inline-block' }}>
      {stars.map(renderStar)}
    </div>
  );
};

CustomReactStars.propTypes = {
  count: PropTypes.number,
  value: PropTypes.number,
  size: PropTypes.number,
  edit: PropTypes.bool,
  isHalf: PropTypes.bool,
  emptyIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  halfIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  filledIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  activeColor: PropTypes.string,
  color: PropTypes.string,
  onChange: PropTypes.func,
  a11y: PropTypes.bool,
  classNames: PropTypes.string,
  char: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default CustomReactStars; 