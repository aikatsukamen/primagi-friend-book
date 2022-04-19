import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import { Button, Hidden } from '@mui/material';

const useStyles = () =>
  makeStyles({
    root: {
      display: 'flex',
      position: 'relative',
    },
  })();

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const App: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles();

  return (
    <>
      <div>qrregist</div>
    </>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    // preview: state.reducer.mediaPreview,
  };
};

// action
const mapDispatchToProps = {
  // closeMedia: actions.closeMedia,
  // changeMediaIndex: actions.changeMediaIndex,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
