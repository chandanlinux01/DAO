// start new file
export default function CreateProposal() {
  return (
    <>
    <h1>Create Proposal</h1>
    <ul>
      <li>Title</li>
      <li>Description</li>
      <li>image </li>
      <li>video</li>
    </ul>
    <form>
    <label>
      Name:
      <input type="text" name="name" />
    </label>
    <label>
      Email:

      <input type="text" name="email" />
    </label>
    <label>
      Message:
      <input type="text" name="message" />
    </label>
    <input type="submit" value="Submit" />
  </form>
    </>
  );
}