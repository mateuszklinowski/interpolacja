/**
 * returns LaTeX formated string for interpolation (licznik)
 * @param index
 * @param points
 * @returns {string}
 */
const createCounterString = (index, points) => {
    let counter = '';
    points.forEach((point, i)=>{
        if(i !== index){
            counter += `( x - ${point.x} )`
        }
    });
    return counter

};

/**
 * returns LaTeX formated string for interpolation (mianownik)
 * @param index
 * @param points
 * @returns {string}
 */
const createDenominatorString = (index, points) => {

    let denominator = '';
    points.forEach((point,i)=>{
        if(i !== index){
            denominator += `(${points[index].x} - ${point.x})`
        }
    });
    return denominator;
};

/**
 * create interpolation function string in LaTeX format
 * @param points
 * @returns {string}
 */
export const createInterpolationString = (points) => {
    let interpolation = '';
    points.forEach((point,index)=>{
        interpolation += `${point.y}  \\frac{${createCounterString(index,points)}}{${createDenominatorString(index,points)}}`;
        if(points[index+1]){
            interpolation += '+';
        }
    });
    return interpolation;
};


/**
 * calculate licznik for given interpolation element W(x)
 * @param x
 * @param index
 * @param points
 * @returns {*|number}
 */
const licznik = (x, index, points) => {
    let elements = [];
    points.forEach((point, i)=>{
       if(i!== index){
           elements.push(x-point.x);
       }
    });
    return elements.reduce((sum,curr) => {
        return sum * curr;
    },1)
};

/**
 *  calculate mianownik for given interpolation element W(x)
 * @param x
 * @param index
 * @param points
 * @returns {*|number}
 */
const mianownik = (x, index, points) => {
    let elements = [];
    points.forEach((point, i)=>{
        if(i!== index){
            elements.push(points[index].x - point.x);
        }
    });
    return elements.reduce((sum,curr) => {
        return sum * curr;
    },1)
};

/**
 * HOF returning function that is valid interpolation function for given set of points
 * @param points
 * @returns {function(x: number) => number}
 */
export const createInterpolationFunction = (points) => {

    points = points.map(point=>{
        return {
            x: parseFloat(point.x),
            y: parseFloat(point.y)
        }
    });
  return (x) => {
      return points.map((point,index) => {
          return point.y * ((licznik(x, index, points)/mianownik(x, index, points)))
      })
          .reduce((sum,curr) =>{
              return sum + curr;
          },0);
  }
};
