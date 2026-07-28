// Nexus connection state (spec v3.2 section 2). One pure function decides how a
// lesson-linked Connections row renders, from the reader's route progress against
// the lesson's position in that route. No caching, no side effects, no I/O - it is
// recomputed at render (spec section 11: progress reset / reordering must be safe).
//
//   completed  user is PAST the lesson         -> tap opens the full lesson
//   up_next    the lesson is current/next      -> tap opens the full lesson
//   ahead      user has NOT reached it yet      -> tap opens the STORY CARD only
//
// Positions are 1-based within a route. routeProgress maps a route id to the count
// of lessons the user has completed in it (0 = zero progress). "Up next" is the
// single lesson at completed + 1; with zero progress that is lesson 1, and every
// later lesson is ahead - exactly the boundary the spec pins.

export const CONNECTION_STATES = Object.freeze(['completed', 'up_next', 'ahead']);

/**
 * @param {{lessonId:string, route:string, position:number}} entity
 * @param {Record<string, number>} routeProgress  route id -> completed lesson count
 * @returns {'completed'|'up_next'|'ahead'}
 */
export function connectionState(entity, routeProgress) {
  if (!entity || typeof entity.position !== 'number' || entity.position < 1) {
    throw new Error('connectionState: entity.position must be a 1-based number');
  }
  const completed = Math.max(0, Number((routeProgress && routeProgress[entity.route]) || 0));
  const upNext = completed + 1;
  if (entity.position < upNext) return 'completed';
  if (entity.position === upNext) return 'up_next';
  return 'ahead';
}
