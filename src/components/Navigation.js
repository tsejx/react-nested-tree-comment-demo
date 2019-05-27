import React from 'react'
import './Navigation.css'


const navList = [
    {
      title: 'welcome',
      link: '/welcome',
    },
    {
      title: 'new',
      link: '/new',
    },
    {
      title: 'threads',
      link: '/thread',
    },
    {
      title: 'past',
      link: '/past',
    },
    {
      title: 'comments',
      link: '/comments',
    },
    {
      title: 'ask',
      link: '/ask',
    },
    {
      title: 'show',
      link: '/show',
    },
    {
      title: 'jobs',
      link: '/jobs',
    },
    {
      title: 'submit',
      link: '/submit',
    },
  ];

  export default function Navigation(props) {

    const cls = 'navigation'

    return (
      <div className={cls}>
        <span className={`${cls}-logo`}>Y</span>
        <b className={`${cls}-header`}>Hacker News</b>
        <ul className={`${cls}-nav`}>
          {navList.map(item => (
            <li key={item.title} className={`${cls}-nav-item`}>
              <a href="">{item.title}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
