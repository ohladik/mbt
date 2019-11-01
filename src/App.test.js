import React from 'react';
import Feedback from './App';
import { Machine } from 'xstate';
import { render, fireEvent, cleanup, waitForElement } from '@testing-library/react';
import { assert } from 'chai';
import { createModel } from '@xstate/test';

const feedbackMachine = Machine({
    initial: 'question',
    states: {
      question: {
        on: {
          GOOD: 'thanks',
          BAD: 'form',
          // CLOSE: 'closed',
        },
        meta: {
            test: ({ getByText }) => assert(getByText('How was your experience?'))
        }
      },
      form: {
        on: {
          SUBMIT: 'thanks',
          // CLOSE: 'closed',
        }
      },
      thanks: {
        on: {
          // CLOSE: 'closed',
        },
        meta: {
            test: ({ getByText }) => assert(getByText('Thanks for your feedback.'))
        }
      },
      closed: {}
    },
    on: {
      CLOSE: '.closed'
    }
  });

describe('simple paths', () => {
    const testModel = createModel(feedbackMachine).withEvents({
        GOOD: ({ getByText }) => {
            fireEvent.click(getByText('Good'));
        }
    });

    const testPlans = testModel.getSimplePathPlans();

    testPlans.forEach(plan => {
        afterEach(cleanup);

        describe(plan.description, () => {
            plan.paths.forEach(path => {
                it(path.description, () => {
                    const rendered = render(<Feedback />);
                    
                    return path.test(rendered);
                })
            })

        })
    })
})

// Write your integration tests here
// describe('question screen', () => {
//     afterEach(cleanup);

//     it('should go to the thanks screen when GOOD si clicked', () => {
//         const { getByText } = render(<Feedback />);

//         assert(getByText('How was your experience?'));

//         fireEvent.click(getByText('Good'));

//         assert(getByText('Thanks for your feedback.'));
//     });

//     it('should go to the question screen when BAD si clicked', () => {
//         const { getByText } = render(<Feedback />);
//         fireEvent.click(getByText('Bad'));

//         assert(getByText('Care to tell us why?'));
//     });
// });
