const composeXmlHead = (body)=>{
    return `<!DOCTYPE fcpxml>

<fcpxml version="1.8">
${body}
</fcpxml>`
};

const composeXmlResources = (assets) =>{
return `<resources>
        ${assets}
</resources>`;
};

/**
 * 
 * @param {string} asset.id - r1
 * @param {string} asset.src - file:///clipName.mp4
 * @param {string} asset.start - s0
 * @param {string} asset.duration - 10s
 * @param {int} asset.hasVideo - 1
 * @param {int} asset.hasAudio - 1
 * @param {string} asset.format  - r2
 * @param {int} asset.audioSources - 1
 * @param {int} asset.audioChannels - 2
 *  @param {int} asset.audioRate - 48000
 * @param {object} asset.formatData 
 * @param {string} asset.formatData.id  - r2
 * @param {string} asset.formatData.formatName  - FFVideoFormat720p25
 */
const composeAsset = ({
    id, 
    src, 
    start, 
    duration, 
    hasVideo = 1, 
    hasAudio = 1, 
    formatId, 
    audioSources = 1, 
    audioChannels = 2, 
    formatData,
    audioRate = 48000
    })=>{
    return `  <asset id="${id}" src="${src}" start="${start}s" duration="${duration}s" hasVideo="${hasVideo}" hasAudio="${hasAudio}" format="${formatId}" audioSources="${audioSources}" audioChannels="${audioChannels}" audioRate="${audioRate}"/>
  ${composeFormat(formatData)}`;
}

/**
* @param {*} id - r2
 * @param {*} name - FFVideoFormat720p25
 */
const composeFormat = ({id, formatName ='FFVideoFormat720p25'})=>{
    return `<format id="${id}" name="${formatName}"/>`
}

/**
 * 
 * @param {*} sequenceFormatId - r2 
 */
const composeSequence = ({eventName, projectName, sequenceFormatId = 'r2', assetClips })=>{
 return ` <library>
 <event name="${eventName}">
     <project name="${projectName}">
         <sequence format="${sequenceFormatId}">
             <spine>
                 ${assetClips}
             </spine>
         </sequence>
     </project>
     <!-- optionally if want to show clips used in the project event, under the sequence/compound clip - could add those here too -->
     <!-- Clips -->
     <!-- <asset-clip name="Basically, we're pretty happy with it - W1A - Series 3 Episode 3 Preview - BBC Two-ONWNWBoqTuM" ref="r1" format="r2" duration="5s" audioRole="dialogue"/> -->
     </event>
</library>`
}


const composeAssetClip = ({clipName, ref, start, duration, audioRole = 'dialogue'})=>{
    // if offset present then calculate offset - have offset default to zero if not provided
    return `<asset-clip name="${clipName}" ref="${ref}" start="${start}s" duration="${duration}s" audioRole="${audioRole}"/>`
}


const jsonToFCPX = (sequenceEDLJson)=>{
   const FRAME_RATE = 2500;
   const ROUND_TO = 100;
   let counterIdAssetClips = 1;
   // sequenceEDLJson.events 
   const assetClips = sequenceEDLJson.events.map((event, index) => {
        const durationFrames = (event.endTime - event.startTime) * FRAME_RATE;
        const roundedDuration = Math.round(durationFrames / ROUND_TO) * ROUND_TO; // rounding to 100 removes clip boundary warning on FCPX import
        const results = composeAssetClip( {
            clipName: event.clipName, 
            ref:`r${counterIdAssetClips}`,
            start: `${ event.startTime * FRAME_RATE }/${ FRAME_RATE }`,
            duration: `${ roundedDuration }/${ FRAME_RATE }`
       })
        counterIdAssetClips=counterIdAssetClips+2;
        return results;
    })
    const sequence = composeSequence({
        eventName: sequenceEDLJson.title, 
        projectName: sequenceEDLJson.title,
        assetClips: assetClips.join('\n')
    })

    let counterId = 1;
    const assets = sequenceEDLJson.events.map((event, index)=>{

        const results = composeAsset( {id: `r${counterId}`, 
            src: event.clipName, 
            start: 0, 
            duration: event.endTime,
            // hasVideo = 1, 
            // hasAudio = 1, 
            formatId: `r${counterId+1}`, 
            // audioSources = 1, 
            // audioChannels = 2, 
            formatData: {id: `r${counterId+1}`, name: `FFVideoFormat1080p${event.fps}`},
            // audioRate = 48000
        });
        counterId =counterId+2;

        return results;
    })

    const resources = composeXmlResources(assets.join('\n'))
    const result = composeXmlHead(resources+sequence)
    return result;
}


module.exports = jsonToFCPX
