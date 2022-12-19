import React from "react";
import { connect, useSelector } from 'react-redux';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, Colors } from 'chart.js'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    Colors
)

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function Home () {
    const evalResult = useSelector((state) => state.evalResult);
    let colors_mapped_to_exp_id = JSON.parse(localStorage.getItem("colors_mapped_to_exp_id")) || {};
    let train_f1_score_macro_datasets = [];
    let train_precision_macro_datasets = [];
    let train_recall_macro_datasets = [];
    let train_cross_entropy_loss_datasets = [];
    let labels = [];
    let ids = [];
    evalResult.forEach((evalData) => {

        let prevIndex = null;

        if(ids.includes(evalData.experiment_id))
        {
            prevIndex = ids.indexOf(evalData.experiment_id);
        }
        else
        {
            ids.push(evalData.experiment_id);
            if(colors_mapped_to_exp_id[evalData.experiment_id] === undefined)
            {
                let random_color = getRandomColor();
                colors_mapped_to_exp_id[evalData.experiment_id] = random_color;
                localStorage.setItem("colors_mapped_to_exp_id",JSON.stringify(colors_mapped_to_exp_id));
            }
        }
        if(!labels.includes(evalData.epoch))
        {
            labels.push(evalData.epoch);
        }

        if(prevIndex!==null)
        {
            train_f1_score_macro_datasets[prevIndex].data = [...train_f1_score_macro_datasets[prevIndex].data, ...evalData.train_F1_SCORE_macro]
            
            train_precision_macro_datasets[prevIndex].data = [...train_precision_macro_datasets[prevIndex].data, ...evalData.train_PRECISION_macro]
            
            train_recall_macro_datasets[prevIndex].data = [...train_recall_macro_datasets[prevIndex].data, ...evalData.train_RECALL_macro]

            train_cross_entropy_loss_datasets[prevIndex].data = [...train_cross_entropy_loss_datasets[prevIndex].data, ...evalData.train_cross_entropy_loss]
        }
        else
        {            
            train_f1_score_macro_datasets.push({
                exp_id: evalData.experiment_id,
                label: "experiment_"+evalData.experiment_id.toString(),
                data: evalData.train_F1_SCORE_macro,
                fill: false,
                backgroundColor: colors_mapped_to_exp_id[evalData.experiment_id],
                borderColor: colors_mapped_to_exp_id[evalData.experiment_id]
            });

            train_precision_macro_datasets.push({
                exp_id: evalData.experiment_id,
                label: "experiment_"+evalData.experiment_id.toString(),
                data: evalData.train_PRECISION_macro,
                fill: false,
                backgroundColor: colors_mapped_to_exp_id[evalData.experiment_id],
                borderColor: colors_mapped_to_exp_id[evalData.experiment_id]
            });

            train_recall_macro_datasets.push({
                exp_id: evalData.experiment_id,
                label: "experiment_"+evalData.experiment_id.toString(),
                data: evalData.train_RECALL_macro,
                fill: false,
                backgroundColor: colors_mapped_to_exp_id[evalData.experiment_id],
                borderColor: colors_mapped_to_exp_id[evalData.experiment_id]
            });

            train_cross_entropy_loss_datasets.push({
                exp_id: evalData.experiment_id,
                label: "experiment_"+evalData.experiment_id.toString(),
                data: evalData.train_cross_entropy_loss,
                fill: false,
                backgroundColor: colors_mapped_to_exp_id[evalData.experiment_id],
                borderColor: colors_mapped_to_exp_id[evalData.experiment_id],
                xAxisID: 'x'
            });
        }
    })

    let train_f1_score_macro = {};
    let train_precision_macro = {};
    let train_recall_macro = {};
    let train_cross_entropy_loss = {};
    let common_options = {
        plugins: {
            title: {
                display: true,
                text: 'Train: ',
                color: 'black',
                font: {
                    weight: 'bold',
                    size: '20px'
                }
            }
        }
    }
    if(evalResult)
    {
        let train_f1_score_macro_options = structuredClone(common_options);
        train_f1_score_macro_options.plugins.title.text += " F1 Score Macro";
        train_f1_score_macro = {
            train_f1_score_macro_data: {
                labels: labels,
                datasets: train_f1_score_macro_datasets.sort((a,b) => (a.exp_id > b.exp_id) ? 1 : -1)
            },
            options: train_f1_score_macro_options
        }

        let train_precision_macro_options = structuredClone(common_options);
        train_precision_macro_options.plugins.title.text += " Precision Macro";
        train_precision_macro = {
            train_precision_macro_data : {
                labels: labels,
                datasets: train_precision_macro_datasets.sort((a,b) => (a.exp_id > b.exp_id) ? 1 : -1),
            },
            options: train_precision_macro_options
        }

        let train_recall_macro_options = structuredClone(common_options);
        train_recall_macro_options.plugins.title.text += " Recall Macro";
        train_recall_macro = {
            train_recall_macro_data: {
                labels: labels,
                datasets: train_recall_macro_datasets.sort((a,b) => (a.exp_id > b.exp_id) ? 1 : -1)
            },
            options: train_recall_macro_options
        }

        let train_cross_entropy_loss_options = structuredClone(common_options);
        train_cross_entropy_loss_options.plugins.title.text += " Cross Entropy Loss";
        train_cross_entropy_loss = {
            train_cross_entropy_loss_data: {
                labels: labels,
                datasets: train_cross_entropy_loss_datasets.sort((a,b) => (a.exp_id > b.exp_id) ? 1 : -1)
            },
            options: train_cross_entropy_loss_options
        }
    }

    return(
        <div>
            <div style={styles.main_h2}>
                Training Scores & Loss
            </div>
            <div style={styles.main}>
                {
                    train_f1_score_macro ?
                    <div style={styles.child}>
                        <Line 
                            data={train_f1_score_macro.train_f1_score_macro_data} 
                            options={train_f1_score_macro.options}
                        />
                    </div>
                    :
                    null
                }
                {
                    train_precision_macro ?
                    <div style={styles.child}>
                        <Line 
                            data={train_precision_macro.train_precision_macro_data} 
                            options={train_precision_macro.options}
                        />
                    </div>
                    :
                    null
                }
            </div>
            <hr/>
            <div style={styles.main}>
                {
                    train_recall_macro ?
                    <div style={styles.child}>
                        <Line 
                            data={train_recall_macro.train_recall_macro_data} 
                            options={train_recall_macro.options}
                        />
                    </div>
                    :
                    null
                }
                {
                    train_cross_entropy_loss ?
                    <div style={styles.child}>
                        <Line
                            data={train_cross_entropy_loss.train_cross_entropy_loss_data}
                            options={train_cross_entropy_loss.options}
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
    main_h2: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightblue',
        color: 'darkblue',
        fontSize: '30px',
        fontWeight: 'bold',
        padding: '10px',
        marginBottom: '10px'
    },
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

const mapStateToProps = (state) => ({
    evalResult: state.evalResult
});

// const mapDispatchToProps = { mapExperimentIdToColor };

export default connect(mapStateToProps)(Home);