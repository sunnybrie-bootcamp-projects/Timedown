//Task Requests
export const getTasks = async (user) => {
  const response = await fetch("/api/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "timedown-user": user,
    },
  });
  return response.json();
};

export const addTask = async (
  userId,
  dueDate,
  estTime,
  summary,
  description,
) => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, dueDate, estTime, summary, description }),
  });

  return getTasks(userId);
};

export const deleteTask = async (id) => {
  const response = await fetch("/api/tasks/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  return response.json();
};

//User Account Requests
export const getUser = async (email) => {
  console.debug("apiClient/getUser()");
  console.debug({ email });
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  console.debug(response);
  return response.json();
};

//TimeBlock Requests

//Check-In Requests
