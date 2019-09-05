import React from "react";

export const renderStars = function(ratingString) {
  const stars = [];
  if (ratingString) {
    const rating = Math.round(2 * Number(ratingString));
    const bool = rating % 2;
    for (let i = 0; i < 10; i = i + 2) {
      // Cas rating = 6
      if (bool === 0 && (i % 2 === 0 || i === 0)) {
        // ON ne prend que les chiffres paires 0,2,4,6
        if (i < rating) {
          stars.push(
            <div className="blockStar">
              <i className="fas fa-star leftStar" />
              <i className="fas fa-star rightStar" />
            </div>
          );
        } else {
          stars.push(
            <div className="blockStar">
              <i className="far fa-star-half leftStar" />
              <i className="far fa-star-half rightStar" />
            </div>
          );
        }
      }
      // On prend les chiffres impaires 1,3,5,7,9
      if (bool === 1 && (i % 2 === 0 || i === 0)) {
        if (i < rating - 1) {
          stars.push(
            <div className="blockStar">
              <i className="fas fa-star leftStar" />
              <i className="fas fa-star rightStar" />
            </div>
          );
        } else if (i === rating - 1) {
          stars.push(
            <div className="blockStar">
              <i className="fas fa-star-half leftStar" />
              <i className="far fa-star-half rightStar" />
            </div>
          );
        } else {
          stars.push(
            <div className="blockStar">
              <i className="far fa-star-half leftStar" />
              <i className="far fa-star-half rightStar" />
            </div>
          );
        }
      }
    }
  }
  return <div className="renderStars">{stars}</div>;
};

export const searchFilter = (array, filter, searchParameter) => {
  array = array.filter(search => {
    let bool = false;
    searchParameter.forEach(e => {
      if (search[e].toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        bool = true;
      }
      return e;
    });
    return bool;
  });
  return array;
};
