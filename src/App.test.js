import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { renderWithProvider } from './test-utils.js'

test('properly adds and deletes todo task', async () => {
  const user = userEvent.setup();
  const store = renderWithProvider(<App/>);
  
  const inputElement = await screen.findByTestId('textInput');
  await user.type(inputElement, "Test Todo");

  const submitButton = await screen.findByTestId('submitButton');
  await user.click(submitButton);
  
  const stateBefore = store.getState();
  const addedItemText = await screen.findByTestId('addedItemText')
  expect(addedItemText.textContent).toContain('Test Todo');
  expect(stateBefore.todo[0].text).toBe('Test Todo')

  const deleteTaskButton = await screen.findByTestId('deleteTaskButton');
  await user.click(deleteTaskButton);
  const stateAfter = store.getState();
  expect(stateAfter.todo[0]).toBeUndefined;

  expect(screen.queryByTestId('addedItemText')).toBeNull();
});

test('properly sets priority', async () => {
  const user = userEvent.setup();
  const store = renderWithProvider(<App/>);
  
  const inputElement = await screen.findByTestId('textInput');
  await user.type(inputElement, "Test Todo");
  const priorityOption = await screen.findByTestId('priorityOption');
  await user.selectOptions(priorityOption, 'HIGH');
  const submitButton = await screen.findByTestId('submitButton');
  await user.click(submitButton);
  const state = store.getState();

  expect(state.todo[0].priority).toBe("HIGH");
});

test('properly filters by priority', async () => {
  const user = userEvent.setup();
  const store = renderWithProvider(<App/>);
  
  const inputElement = await screen.findByTestId('textInput');
  await user.type(inputElement, "Test Todo");
  const priorityOption = await screen.findByTestId('priorityOption');
  await user.selectOptions(priorityOption, 'LOW');
  const submitButton = await screen.findByTestId('submitButton');
  await user.click(submitButton);

  await user.type(inputElement, "Test Todo");
  await user.selectOptions(priorityOption, 'MEDIUM');
  await user.click(submitButton);

  await user.type(inputElement, "Test Todo");
  await user.selectOptions(priorityOption, 'HIGH');
  await user.click(submitButton);
  
  
  const stateBefore = store.getState();
  expect(stateBefore.todo[0].priority).toBe("LOW");
  expect(stateBefore.todo[1].priority).toBe("MEDIUM");
  expect(stateBefore.todo[2].priority).toBe("HIGH");

  const priorityFilter = await screen.findByTestId('priorityFilter');
  await user.selectOptions(priorityFilter, 'FILTER_HIGH_PRIORITY');
  const stateAfterHighSelect = store.getState();

  expect(stateAfterHighSelect.todo[0].priority).toBe("HIGH");
  expect(stateAfterHighSelect.todo[1].priority).toBe("MEDIUM");
  expect(stateAfterHighSelect.todo[2].priority).toBe("LOW");

  await user.selectOptions(priorityFilter, 'FILTER_LOW_PRIORITY');
  const stateAfterLowSelect = store.getState();
  expect(stateAfterLowSelect.todo[0].priority).toBe("LOW");
  expect(stateAfterLowSelect.todo[1].priority).toBe("MEDIUM");
  expect(stateAfterLowSelect.todo[2].priority).toBe("HIGH");
});

test('properly completes task', async () => {
  const user = userEvent.setup();
  const store = renderWithProvider(<App/>);
  
  const inputElement = await screen.findByTestId('textInput');
  await user.type(inputElement, "Test Todo");

  const submitButton = await screen.findByTestId('submitButton');
  await user.click(submitButton);
  
  const stateBefore = store.getState();
  const addedItemText = await screen.findByTestId('addedItemText');
  expect(addedItemText.textContent).toContain('Test Todo');
  expect(stateBefore.todo[0].text).toBe('Test Todo');
  expect(stateBefore.todo[0].completed).toBe(false);
  
  const completeTaskButton = await screen.findByTestId('completeTaskButton');
  await user.click(completeTaskButton);
  const stateAfter = store.getState();
  expect(stateAfter.todo[0].completed).toBe(true);
});

test('properly adds and completes subtask', async () => {
  const user = userEvent.setup();
  const store = renderWithProvider(<App/>);
  
  const inputElement = await screen.findByTestId('textInput');
  await user.type(inputElement, "Test Todo");

  const submitButton = await screen.findByTestId('submitButton');
  await user.click(submitButton);

  const displayInputButton = await screen.findByTestId('displayInputButton');
  await user.click(displayInputButton);

  const subtaskTextInput = await screen.findByTestId('subtaskTextInput');
  await user.type(subtaskTextInput, "Test Subtask");
  
  const addSubtaskButton = await screen.findByTestId('addSubtaskButton');
  await user.click(addSubtaskButton);

  const stateBefore = store.getState();
  const subtaskText = await screen.findByTestId('subtaskText');

  expect(subtaskText.textContent).toContain('Test Subtask');
  expect(stateBefore.todo[0].subtasks[0].text).toBe('Test Subtask');

  const completeSubtaskButton = await screen.findByTestId('completeSubtaskButton');
  await user.click(completeSubtaskButton);

  const stateAfter = store.getState();
  expect(screen.queryByTestId('subtaskText')).toBeNull();
  expect(stateAfter.todo[0].subtasks[0]).toBeUndefined;
})