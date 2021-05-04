import { RTSeePeerConnection } from './RTSeePeerConnection';


export class RTSeePeerConnectionsList {
  connections: RTSeePeerConnection[] = [];
  connectionsHash: { [key: string]: RTSeePeerConnection; } = {};

  add(peerConnection: RTSeePeerConnection): RTSeePeerConnection {
    this.connections.push(peerConnection);
    this.connectionsHash[peerConnection.clientId] = peerConnection;
    console.log(this.connections);
    return peerConnection;
  }

  remove(peerConnection: RTSeePeerConnection): any {
    const indexToRemove = this.connections.indexOf(peerConnection);
    if (!indexToRemove) { return false; }
    this.connections.splice(indexToRemove, 1);
    delete this.connectionsHash[peerConnection.clientId];
  }

  addIceCandidate(clientId: string, candidate: RTCIceCandidate): any {
    if (!this.connectionsHash[clientId]) { return false; }
    return this.connectionsHash[clientId].connection.addIceCandidate(candidate);
  }

  setRemoteDescription(clientId: string, sdp: RTCSessionDescription): any {
    if (!this.connectionsHash[clientId]) { return false; }
    return this.connectionsHash[clientId].connection.setRemoteDescription(sdp);
  }

  muteLocalAudio(): void {
    this.connections.forEach(elem => elem.muteLocalAudio());
  }
}
