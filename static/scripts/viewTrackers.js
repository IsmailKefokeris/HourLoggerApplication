
const trackerPosition = (tracker) => `
<tr>
    <td class="text-center">${tracker.date}</td>
    <td class="text-center">${tracker.startTime}</td>
    <td class="text-center">${tracker.endTime}</td>
    <td class="text-center">${tracker.totalHours}</td>
    <td class="text-center">
        <a href="/edit/${tracker._id}" class='btn btn-secondary btn-xs'>
            Edit
        </a> 
        <a  href="/delete/${tracker._id}" class="btn btn-danger btn-xs">
            Remove
        </a>
    </td>
</tr>
`;


const viewHandle = async (v) => {
    const id = v.name;
    const trackerLocations = document.querySelector('#trackerItems');
    const messageLocation = document.querySelector("messageBox");
    // console.log(`ID: ${id}`);

    try {
        const findTrack = await fetch(`/api/view?id=${id}`);
        const results = await findTrack.json();

        let trackList = [];
        if(results){
            results.forEach(tracker => {
                trackList.push(trackerPosition(tracker));
            });
            trackerLocations.innerHTML = trackList.join("");
        } else {
            const message = "UNABLE TO FIND TRACKERS...CREATE NEW!";
            messageLocation.innerHTML = message;
        }
    } catch (e) {
        console.log(e);
        console.log('could not search api');
    }


}