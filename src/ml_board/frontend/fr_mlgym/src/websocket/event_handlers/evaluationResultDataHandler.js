const handleExperimentStatusData = (data) => {
    // console.log("In Handle Exp = ",data);
    let exp_eval_result_data = {
        epoch: [data.epoch],
        experiment_id: data.experiment_id,
        grid_search_id: data.grid_search_id
    };
    if(data.loss_scores[0].split !== "train")
    {
        return null;
    }
    for(let i=0; i<data.loss_scores.length; i++)
    {
        let d = data.loss_scores[i]
        exp_eval_result_data[d.split + "_" + d.loss] = [];
        exp_eval_result_data[d.split + "_" + d.loss].push(d.score);
    }
    for(let i=0; i<data.metric_scores.length; i++)
    {
        let d = data.metric_scores[i]
        exp_eval_result_data[d.split + "_" + d.metric] = [];
        exp_eval_result_data[d.split + "_" + d.metric].push(d.score);
    }
    return exp_eval_result_data;
}

export default handleExperimentStatusData;