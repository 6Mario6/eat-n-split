import { FormEvent, ReactNode, useState } from "react";

const initialFriends = [
  {
    id: "118836",
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: "933372",
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: "499476",
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

type FriendType = {
  id: string;
  name: string;
  image: string;
  balance: number;
};

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<FriendType | null>(null);

  const handleShowAddFriend = () => {
    setShowAddFriend(!showAddFriend);
  };
  const handleAddFriend = (friend: FriendType) => {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  };

  const handleSelectFriend = (friend: FriendType) => {
    setSelectedFriend((selectedFriend) => {
      if (selectedFriend?.id === friend.id) {
        return null;
      }
      return friend;
    });
    setShowAddFriend(false);
  };

  const handleSplitBill = (value: number) => {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend?.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          selectedFriend={selectedFriend}
          friends={friends}
          onSelectedFriend={handleSelectFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

export default App;

const FriendsList = ({
  selectedFriend,
  friends,
  onSelectedFriend,
}: {
  selectedFriend: FriendType | null;
  friends: FriendType[];
  onSelectedFriend: (friend: FriendType) => void;
}) => {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelectedFriend={onSelectedFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
};

const Friend = ({
  selectedFriend,
  friend,
  onSelectedFriend,
}: {
  selectedFriend: FriendType | null;
  friend: FriendType;
  onSelectedFriend: (friend: FriendType) => void;
}) => {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
};

const Button = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: ReactNode;
}) => {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
};

const FormAddFriend = ({
  onAddFriend,
}: {
  onAddFriend: (friend: FriendType) => void;
}) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name && !image) {
      return;
    }
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?u=${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  };
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫🏾 Friend name</label>
      <input
        value={name}
        type="text"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <label>🌄 Image URL</label>
      <input value={image} onChange={(e) => setImage(e.target.value)} />
      <Button>Add</Button>
    </form>
  );
};

const FormSplitBill = ({
  selectedFriend,
  onSplitBill,
}: {
  selectedFriend: FriendType;
  onSplitBill: (value: number) => void;
}) => {
  const [bill, setBill] = useState(0);
  const [paidByUser, setPaidByUser] = useState(0);
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByFriend = bill - paidByUser;
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (bill === 0 || paidByUser === 0) {
      return;
    }
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💸 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>💰 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) => {
          return setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          );
        }}
      />
      <label>👫🏾 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
};
