import React from "react";
import { connect } from 'react-redux';
// import { LineChart } from "recharts";
// import { CartesianGrid             } from "recharts";
// import { XAxis                     } from "recharts";
// import { YAxis                     } from "recharts";
// import { Tooltip                   } from "recharts";
// import { Legend                    } from "recharts";
// import { Line                      } from "recharts";
import { useSelector } from 'react-redux';
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)


function Home () {
    const evalResult = useSelector((state) => state.evalResult);
    let datasets = [];
    let datasets2 = [];
    let datasets3 = [];
    let datasets4 = [];
    let labels = [];
    let ids = [];
    evalResult.forEach((evalData, index) => {
        // console.log("evalData = ",evalData);
        // let prevData = {};
        let prevIndex = null;
        if(ids.includes(evalData.experiment_id))
        {
            prevIndex = ids.indexOf(evalData.experiment_id);
            // prevData = evalResult[prevIndex];
        }
        else
        {
            ids.push(evalData.experiment_id);
        }
        if(!labels.includes(evalData.epoch[0]))
        {
            labels.push(evalData.epoch[0]);
        }

        if(prevIndex!==null)
        {
            datasets[prevIndex].data = [...datasets[prevIndex].data, ...evalData.train_F1_SCORE_macro]
            datasets2[prevIndex].data = [...datasets2[prevIndex].data, ...evalData.train_PRECISION_macro]
            datasets3[prevIndex].data = [...datasets3[prevIndex].data, ...evalData.train_RECALL_macro]
            datasets4[prevIndex].data = [...datasets4[prevIndex].data, ...evalData.train_cross_entropy_loss]

        }
        else
        {
            datasets.push({
                label: "experiment_"+evalData.experiment_id.toString(),
                data: evalData.train_F1_SCORE_macro,
                fill: false,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            });

            datasets2.push({
                label: "experiment_"+evalData.experiment_id.toString(),
                data: evalData.train_PRECISION_macro,
                fill: false,
                backgroundColor: "green",
                borderColor: "green"
            });

            datasets3.push({
                label: "experiment_"+evalData.experiment_id.toString(),
                data: evalData.train_RECALL_macro,
                fill: false,
                backgroundColor: "pink",
                borderColor: "pink"
            });

            datasets4.push({
                label: "experiment_"+evalData.experiment_id.toString(),
                data: evalData.train_cross_entropy_loss,
                fill: false,
                backgroundColor: "red",
                borderColor: "red"
            });
        }
    })
    let data = {};
    let data2 = {};
    let data3 = {};
    let data4 = {};

    if(evalResult)
    {
        data = {
            labels: labels,
            datasets: datasets
        }
        data2 = {
            labels: labels,
            datasets: datasets2
        }
        data3 = {
            labels: labels,
            datasets: datasets3
        }
        data4 = {
            labels: labels,
            datasets: datasets4
        }
    }
    // console.log("data = ",data);
    return(
        <div>
            <div>
                Home Page
            </div>
            <div style={styles.main}>
                {
                    data ?
                    <div style={styles.child}>
                        <b>train_F1_SCORE_macro</b>
                        <Line data={data} />
                    </div>
                    :
                    null
                }
                {
                    data2 ?
                    <div style={styles.child}>
                        <b>train_PRECISION_macro</b>
                        <Line data={data2} />
                    </div>
                    :
                    null
                }
            </div>
            <hr/>
            <div style={styles.main}>
                {
                    data3 ?
                    <div style={styles.child}>
                        <b>train_RECALL_macro</b>
                        <Line data={data3} />
                    </div>
                    :
                    null
                }
                {
                    data4 ?
                    <div style={styles.child}>
                        <b>train_cross_entropy_loss</b>
                        <Line
                            data={data4} 
                        />
                    </div>
                    :
                    null
                }
            </div>            
        </div>
    );
}

const styles = {
    main: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    child: {
        width: "40%",
        height: "70%",
        marginLeft: "20px",
        marginRight: "20px"
    }
}
// class Home extends React.Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             data: [],
//             loss: [],
//             labels: []
//         }
//     }

//     componentDidMount() {
//         let data = {};
//         if(this.props.evalResult && this.props.evalResult.length > 0 && this.props.evalResult[1] && this.props.evalResult[1].train_F1_SCORE_macro.length>1)
//         {
//             let d = this.props.evalResult[1];
//             console.log("d = ",d.train_F1_SCORE_macro);
            
//             this.setState({
//                 data: data
//             });
//         }
//     }

//     render() {
//         return(
//             <div>
//                 <div>
//                     Hii Home
//                 </div>
//                 {
//                     this.props.evalResult && this.props.evalResult.length > 0 && this.props.evalResult[1] && this.props.evalResult[1].train_F1_SCORE_macro.length > 1?
//                     // <div>
//                     //     Available!
//                     // </div>
//                     <Line 
//                         data={
//                             {
//                                 labels: this.props.evalResult[1].epoch,
//                                 datasets: [
//                                     {
//                                         label: "First dataset",
//                                         data: this.props.evalResult[1].train_F1_SCORE_macro,
//                                         fill: true,
//                                         backgroundColor: "rgba(75,192,192,0.2)",
//                                         borderColor: "rgba(75,192,192,1)"
//                                     }
//                                 ]
//                             }
//                         } 
//                     />
//                     // <LineChart 
//                     //     width={730} 
//                     //     height={250} 
//                     //     data={this.props.evalResult} 
//                     //     margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                     // >
//                     //     <CartesianGrid strokeDasharray="3 3" />
//                     //     <XAxis dataKey="epoch" />
//                     //     <YAxis />
//                     //     <Tooltip />
//                     //     <Legend />
//                     //     {
//                     //         this.props.evalResult.map((data, index)=>{
//                     //             return(
//                     //                 <Line 
//                     //                     key={index}
//                     //                     type="monotone" 
//                     //                     data={data}
//                     //                     dataKey={index}
//                     //                     stroke="#8884d8" 
//                     //                 />
//                     //             );
//                     //         })
//                     //     }
//                     // </LineChart>
//                     :
//                     <div>
//                         No data available
//                     </div>
//                 }
//             </div>
//         );
//     }
// }

const mapStateToProps = (state) => ({
    evalResult: state.evalResult
});

export default connect(mapStateToProps)(Home);