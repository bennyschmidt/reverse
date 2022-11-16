export const sortByDate = array => {
  return array.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateA < dateB
      ? 1
      : dateA > dateB
        ? -1
        : 0;
  });
};

export const request = async (url, body) => (
  fetch(
    url,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )
);
