// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        string proposal;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        uint weight; // 1 for regular voter, 2 for admin
        bool hasVoted;
        uint votedFor;
    }

    struct Winner {
        uint id;
        string name;
        uint voteCount;
        uint percentage;
    }

    address public owner;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    uint public startTime;
    uint public endTime;
    bool public votingStarted;
    bool public votingEnded;
    uint public totalVoters;
    uint public totalVotes;

    // Events
    event CandidateAdded(uint candidateId, string name);
    event VoterRegistered(address voter, uint weight);
    event VoteCast(address voter, uint candidateId);
    event VotingStarted(uint startTime, uint endTime);
    event VotingEnded();

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(voters[msg.sender].weight == 2, "Only admins can call this function");
        _;
    }

    modifier isRegistered() {
        require(voters[msg.sender].isRegistered, "Voter is not registered");
        _;
    }

    modifier hasNotVoted() {
        require(!voters[msg.sender].hasVoted, "Voter has already voted");
        _;
    }

    modifier votingIsActive() {
        require(votingStarted && !votingEnded, "Voting is not active");
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Voting period is not active");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        
        // Register the owner as an admin with weight 2
        voters[owner] = Voter({
            isRegistered: true,
            weight: 2,
            hasVoted: false,
            votedFor: 0
        });
        
        totalVoters = 1;
    }

    // Function to add a candidate (only owner/admin)
    function addCandidate(string memory _name, string memory _proposal) external onlyAdmin {
        uint candidateId = candidates.length;
        candidates.push(Candidate({
            id: candidateId,
            name: _name,
            proposal: _proposal,
            voteCount: 0
        }));
        
        emit CandidateAdded(candidateId, _name);
    }

    // Function to register a voter (only owner/admin)
    function registerVoter(address _voter, uint _weight) external onlyAdmin {
        require(!voters[_voter].isRegistered, "Voter is already registered");
        require(_weight == 1 || _weight == 2, "Weight must be 1 or 2");
        
        voters[_voter] = Voter({
            isRegistered: true,
            weight: _weight,
            hasVoted: false,
            votedFor: 0
        });
        
        totalVoters++;
        
        emit VoterRegistered(_voter, _weight);
    }

    // Function to start voting (only owner/admin)
    function startVoting(uint _startTime, uint _endTime) external onlyAdmin {
        require(!votingStarted, "Voting has already started");
        require(_endTime > _startTime, "End time must be after start time");
        
        startTime = _startTime;
        endTime = _endTime;
        votingStarted = true;
        votingEnded = false;
        
        emit VotingStarted(startTime, endTime);
    }

    // Function to end voting (only owner/admin)
    function endVoting() external onlyAdmin {
        require(votingStarted, "Voting has not started");
        require(!votingEnded, "Voting has already ended");

        if (block.timestamp >= endTime) {
            votingEnded = true;
            votingStarted = false;
            emit VotingEnded();
            return;
        }
        
        votingEnded = true;
        votingStarted = false;
        
        emit VotingEnded();
    }

    // Function to cast a vote
    function vote(uint _candidateId) external isRegistered hasNotVoted votingIsActive {
        require(_candidateId < candidates.length, "Invalid candidate ID");
        
        Voter storage sender = voters[msg.sender];
        sender.hasVoted = true;
        sender.votedFor = _candidateId;
        
        // Add voter's weight to candidate vote count
        candidates[_candidateId].voteCount += sender.weight;
        totalVotes += sender.weight;
        
        emit VoteCast(msg.sender, _candidateId);
    }

    // Function to check if voting is active
    function getVotingStatus() external view returns (bool) {
        if (!votingStarted || votingEnded) {
            return false;
        }
        
        return (block.timestamp >= startTime && block.timestamp <= endTime);
    }

    // Function to get all candidates
    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    // Function to get time remaining in voting period
    function getTimeRemaining() external view returns (uint) {
        if (!votingStarted) {
            return 0; // Voting hasn't started
        }
        
        if (votingEnded) {
            return 0; // Voting has ended
        }
        
        if (block.timestamp < startTime) {
            return endTime - startTime; // Time until voting starts + duration
        }
        
        if (block.timestamp >= endTime) {
            return 0; // Voting period is over
        }
        
        return endTime - block.timestamp; // Actual time remaining
    }

    function getCurrentTime() external view returns (uint) {
        return block.timestamp;
    }

    // Function to get voter information
    function getVoter(address _voter) external view returns (bool voterIsRegistered, uint weight, bool hasVoted, uint votedFor) {
        Voter storage voter = voters[_voter];
        return (voter.isRegistered, voter.weight, voter.hasVoted, voter.votedFor);
    }

    // Function to get total votes
    function getTotalVotes() external view returns (uint) {
        return totalVotes;
    }

    // Function to get total voters
    function getTotalVoters() external view returns (uint) {
        return totalVoters;
    }

    // Function to get start time
    function getStartTime() external view returns (uint) {
        return startTime;
    }

    // Function to get end time
    function getEndTime() external view returns (uint) {
        return endTime;
    }

    // Function to check if caller is admin
    function isAdmin() external view returns (bool) {
        return voters[msg.sender].weight == 2;
    }

    // Function to get the winner of the election
    function getWinner() external view returns (Winner memory) {
        require(candidates.length > 0, "No candidates available");
        
        uint winningVoteCount = 0;
        uint winningCandidateId = 0;
        
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }
        

        
        uint percentage = 0;
        if (totalVotes > 0) {
            // Calculate percentage with precision of 2 decimal places (multiply by 100 for percentage)
            percentage = (winningVoteCount * 10000) / totalVotes;
        }
        
        return Winner({
            id: winningCandidateId,
            name: candidates[winningCandidateId].name,
            voteCount: winningVoteCount,
            percentage: percentage
        });
    }
}
