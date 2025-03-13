import CustomReactStars from './CustomReactStars';
import PropTypes from 'prop-types';

// Wrapper component that uses our custom implementation of ReactStars
// with JavaScript default parameters instead of defaultProps
const StarRating = ({
  count = 5,
  value = 0,
  size = 24,
  edit = false,
  activeColor = "#ffd700",
  ...otherProps
}) => {
  return (
    <CustomReactStars
      count={count}
      value={value}
      size={size}
      edit={edit}
      activeColor={activeColor}
      {...otherProps}
    />
  );
};

StarRating.propTypes = {
  count: PropTypes.number,
  value: PropTypes.number,
  size: PropTypes.number,
  edit: PropTypes.bool,
  activeColor: PropTypes.string
};

export default StarRating; 