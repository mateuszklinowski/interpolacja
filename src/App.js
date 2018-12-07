import React, {Component} from 'react';
import MathJax from 'react-mathjax2';

import {createInterpolationString, createInterpolationFunction} from "./interpolation.helper";

import './App.css';
import {PointInput} from "./components/pointInput/point-input.component";

window.d3 = require('d3');
const functionPlot = require('function-plot');

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            points: [],
            interpolation: '',
        }
    }

    onXChange = (x, index) => {
        let newPoints = this.state.points;
        newPoints[index].x = x;
        this.setState({
            points: newPoints
        })
    };

    onYChange = (y, index) => {
        let newPoints = this.state.points;
        newPoints[index].y = y;
        this.setState({
            points: newPoints
        })
    };

    addPoint = () => {
        this.setState({
            points: this.state.points.concat([{}])
        })
    };

    resetPoints = () => {
        this.setState({
            points: [],
        })
    };

    createInterpolation = () => {
        if(this.state.points.length <= 1){
            this.setState({
                error:'Podaj minimum 2 węzły'
            });
            return;
        }
        else {
            let dataValid = true;
            this.state.points.forEach(point=>{
                if(point.x === undefined || point.y === undefined){
                    this.setState({
                        error:'Brakujace dane!'
                    });
                    dataValid = false;
                }
            });
            if(!dataValid){
                return;
            }

            this.setState({
                error:''
            })
        }

        const interpolationFunction = createInterpolationFunction(this.state.points);
        this.setState({
            interpolation: createInterpolationString(this.state.points),
            interpolationFunction: interpolationFunction,
        });

        const xPoints = this.state.points.map(point=> point.x);
        const yPoints = this.state.points.map(point=> point.y);

        const xMin = parseFloat(xPoints.reduce((prev,curr)=>{
            return prev < curr ? prev : curr
        },xPoints[0]));
        const xMax = parseFloat(xPoints.reduce((prev,curr)=>{
            return prev > curr ? prev : curr
        },xPoints[0]));
        const yMin = parseFloat(yPoints.reduce((prev,curr)=>{
            return prev < curr ? prev : curr
        },yPoints[0]));
        const yMax = parseFloat(yPoints.reduce((prev,curr)=>{
            return prev > curr ? prev : curr
        },yPoints[0]));

        functionPlot({
            width: window.innerWidth*0.9,
            height: window.innerHeight*0.85,
            target: '#chart',
            xAxis: {domain: [xMin-1, xMax+1]},
            yAxis: {domain: [yMin-2, yMax+2]},
            data: [{
                graphType: 'polyline',
                range: [xMin, xMax],
                fn: function (scope) {
                    return interpolationFunction(scope.x);
                }
            }]
        });
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Interpolacja Lagrange’a
                    </p>
                </header>
                <div className="points-wrapper">
                    <p>Podaj wezły:</p>
                    {this.state.points.map((point, index) => {
                        return <PointInput key={index} onXChange={this.onXChange} onYChange={this.onYChange}
                                           index={index}/>
                    })}
                    <br/>
                    <button onClick={this.addPoint}>dodaj</button>
                    <br/>
                    <button onClick={this.resetPoints}>zresetuj</button>
                    <br/>
                    <button onClick={this.createInterpolation}>Oblicz</button>
                    <br/>
                    <span className='error'>
                         {this.state.error ? this.state.error : ''}
                    </span>
                </div>
                <div>
                    <h2>Wielomian interpolacyjny:</h2>
                        <MathJax.Context input='tex'>
                            <div>
                                <MathJax.Node inline>{'W(x) ='}</MathJax.Node> <MathJax.Node inline>{this.state.interpolation}</MathJax.Node>
                            </div>
                        </MathJax.Context>
                </div>

                <div>
                    <h2>Wykres funkcji W(x):</h2>
                    <div id="chart">

                    </div>
                </div>
            </div>
        );
    }
}

export default App;
