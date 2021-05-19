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
  estTimeHours,
  estTimeMinutes,
  summary,
  description,
) => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      dueDate,
      estTimeHours,
      estTimeMinutes,
      summary,
      description,
    }),
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
  const response = await fetch(
    `/api/user/?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.json();
};

export const addUser = async (email) => {
  const response = await fetch(
    `/api/user/?email=${encodeURIComponent(email)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.json();
};

//TimeBlock Requests

//Check-In Requests
